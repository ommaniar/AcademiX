import logging
from django.http import JsonResponse
from django.views import View
from .helpers import add_binary, shift_right, negate
from .models import Article
from .utils import GetRecommendation
import requests
from bs4 import BeautifulSoup

class BoothsAlgorithm(View):
    def get(self, request):
        _list = []
        num1 = self.request.GET.get('num1')
        num2 = self.request.GET.get('num2')
        try:
            assert num1 and num2, 'num1 and num2 are required'
            assert len(num1) == 8 and len(num2) == 8, 'num1 and num2 must be 8 bits long'
            assert all([bit in '01' for bit in num1]) and all([bit in '01' for bit in num2]), 'num1 and num2 must be binary numbers'
        except AssertionError as e:
            return JsonResponse({'error': str(e)}, status=400)
        steps = []
        ac = '00000000'
        qr = num1
        q_1 = '0'
        steps.append({'ac': ac, 'qr': qr, 'q_1': q_1, 'operation': 'Initial'})
        
        for i in range(len(num1)):
            last_bit = qr[-1]
            if last_bit + q_1 == '01':
                ac = add_binary(ac, num2)
                steps.append({'ac': ac, 'qr': qr, 'q_1': q_1, 'operation': 'A = A + M'})
            elif last_bit + q_1 == '10':
                ac = add_binary(ac, negate(num2))
                steps.append({'ac': ac, 'qr': qr, 'q_1': q_1, 'operation': 'A = A - M'})
            
            ac, qr, q_1 = shift_right(ac, qr, q_1)
            steps.append({'ac': ac, 'qr': qr, 'q_1': q_1, 'operation': 'Shift Right'})
        
        bin_result = ac + qr
        negated = False
        if bin_result[0] == '1':
            bin_result = negate(bin_result)
            negated = True
            
        num_result = int(bin_result, 2)
        if negated:
            num_result = -num_result
        
        steps.append({'ac': ac, 'qr': qr, 'q_1': num_result, 'operation': 'Result'})
        return JsonResponse({'result': num_result, 'steps': steps})

class GetAllArticles(View):
    def get(self, request):
        articles = Article.objects.all()
        data = [{'title': article.title, 'content': article.html, 'original-link': article.original_link} for article in articles]
        return JsonResponse(data, safe=False)

class GetArticle(View):
    def get(self, request, *args, **kwargs):
        title = self.kwargs.get('title')
        try:
            assert title, 'title is required'
        except AssertionError as e:
            return JsonResponse({'error': str(e)}, status=400)
        try:
            article = Article.objects.get(title=title)
            data = {'title': article.title, 'content': article.html, 'original-link': article.original_link}
        except Article.DoesNotExist:
            data = {'error': 'Article not found', 'title': title}
        return JsonResponse(data)

class GetSimilarArticles(View):
    def get(self, request, *args, **kwargs):
        title = self.kwargs.get('title')
        try:
            assert title, 'title is required'
        except AssertionError as e:
            return JsonResponse({'error': str(e)}, status=400)
        try:
            article = Article.objects.get(title=title)
            # Compare article.html with other articles with cosine similarity
            # Return top 5 similar articles
            # Escape the html tags and use the content for comparison
            data = {
                     'title': article.title, 
            }
            
            gr = GetRecommendation(title)
            gr.train()
            result = gr.get_result_posts()
            data['recommendations'] = []
            for r in result:
                data['recommendations'].append({'title': r.title}) 
            
            return JsonResponse(data, safe=False)
        except Article.DoesNotExist:
            data = {'error': 'Article not found', 'title': title}
        return JsonResponse(data)

class AddArticle(View):
    def get(self, request):
        original_link = self.request.GET.get('url')
        try:
            assert original_link, 'url is required'
        except AssertionError as e:
            return JsonResponse({'error': str(e)}, status=400)
        try:
            article = Article.objects.get(original_link=original_link)
            return JsonResponse({'error': 'Article already exists'})
        except Exception as e:
            try:
                response = requests.get(original_link)
                soup = BeautifulSoup(response.text, 'html.parser')
                # Remove elements with class .kicker.paragraph, .pw-subtitle-paragraph, .speechify-ignore
                for element in soup.select('.kicker, .paragraph, .pw-subtitle-paragraph, .speechify-ignore, strong.al'):
                    element.decompose()
                html = soup.find('section').prettify()
                title = soup.title.string
                Article.objects.create(title=title, html=html, original_link=original_link)
                return JsonResponse({'message': 'Article added successfully'})
            except requests.exceptions.RequestException as e:
                return JsonResponse({'error': str(e)}, status=400)
            
