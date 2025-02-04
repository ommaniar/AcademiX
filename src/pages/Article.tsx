import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Article = (props) => {
    const { title } = useParams();
    const [article, setArticle] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [feedUrl, setFeedUrl] = useState(null);

    const fetchRecommendations = async () => {
        const res = await fetch(`http://127.0.0.1:8000/api/get-recommendation/${title}`);
        const data = await res.json();
        setRecommendations(data['recommendations'].slice(0, 5));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://127.0.0.1:8000/api/add-article', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                feedUrl: feedUrl,
            }),
        });
        const data = await res.json();
        console.log(data);

    }

    const fetchArticle = async () => {
        const res = await fetch(`http://127.0.0.1:8000/api/get-article/${title}`);
        const data = await res.json();
        // find all wikipedia links and add : in front of their innerHTML
        data.content = data.content.replace(/<a.*?href="https:\/\/.*?\.wikipedia\.org\/wiki\/(.*?)".*?>(.*?)<\/a>/g, (match, p1, p2) => {
            // if it's an image, don't touch it
            if(p1.includes("File:")){
                return match;
            }
            return `<a href="https://en.wikipedia.org/wiki/${p1}">:${p2}</a>`;
        });
        // Remove all elements that contains class metadata in their class attribute with all their innerHTML
        // const pattern = /<.*?class=".*?metadata.*?".*?>.*?<\/.*?>/g;
        // data.content = data.content.replace(pattern, '');
        /** data.content = data.content.replace(/<.*?class=".*?metadata.*?".*?>.*?<\/.*?>/g, (match) => {
            console.log(match);
            return '';
        }); */
        // Remove all table elements that contains class metadata in their class attribute with all their innerHTML
        const dataCopy = data;
        dataCopy.content = dataCopy.content.replace(/<table.*?class=".*?metadata.*?".*?>.*?<\/table>/g, '');
        // Remove all elements that contain role="note" in their attribute with all their innerHTML
        dataCopy.content = dataCopy.content.replace(/<.*?role="note".*?>.*?<\/.*?>/g, '');
        // Remove all elements that contain class side-box in their class attribute with all their innerHTML
        dataCopy.content = dataCopy.content.replace(/<.*?class=".*?side-box.*?".*?>.*?<\/.*?>/g, '');
        // Also remove side-box-flex elements
        dataCopy.content = dataCopy.content.replace(/<.*?class=".*?side-box-.*?">.*?<\/.*?>/g, '');
        // remove table.sidebar
        dataCopy.content = dataCopy.content.replace(/<table class=".*?sidebar.*?">.*?<\/table>/g, '');
        // for some reason any of the above methods didn't work
        const doc = new DOMParser().parseFromString(dataCopy.content, 'text/html');
        const tables = doc.querySelectorAll('table.sidebar');
        tables.forEach((table) => {
            table.remove();
        });
        const metadata = doc.querySelectorAll('.metadata');
        metadata.forEach((meta) => {
            meta.remove();
        });
        const sideBox = doc.querySelectorAll('.side-box');
        sideBox.forEach((box) => {
            box.remove();
        });
        const sideBoxFlex = doc.querySelectorAll('.side-box-flex');
        sideBoxFlex.forEach((box) => {
            box.remove();
        });
        const divRoleNav = doc.querySelectorAll('[role="navigation"]');
        divRoleNav.forEach((div) => {
            div.remove();
        });
        // find heading named External Links and remove it and all the elements after it
        const headings = doc.querySelectorAll('#External_links');

        headings.forEach((heading) => {
           heading.remove();
        });
        dataCopy.content = doc.body.innerHTML;
        setArticle(dataCopy);
        (window as any).Nutshell.start();
        (window as any).Nutshell.setOptions({
            dontEmbedHeadings: true,
        });
    
    }
    useEffect(() => {
        fetchArticle();
        fetchRecommendations();
    }, []);
    useEffect(() => {
        (window as any).Nutshell.start();
        (window as any).Nutshell.setOptions({
            dontEmbedHeadings: true,
        });
    }, [article]);
    if (article === null) {
        return (
            <div className="m-4 flex justify-center items-center flex-col gap-4">
                <div className="m-4 animate-pulse rounded-md bg-muted w-[250px] h-24"></div>
                <div className="m-4 animate-pulse rounded-md bg-muted w-[250px] h-24"></div>
                <div className="m-4 animate-pulse rounded-md bg-muted w-[250px] h-24"></div>
                <div className="m-4 animate-pulse rounded-md bg-muted w-[250px] h-24"></div>
            </div>
        )
    }
    return (
        <>
        <div className="m-4 flex justify-center items-center flex-col">
            <p className="text-3xl md:text-4xl font-extrabold my-4">{decodeURI(article.title).replace(/_/g, ' ')}</p>
            <div className="recommendations">
            <p className="text-lg ml-16 font-bold text-2xl">Recommended Articles</p>
            <div className="flex flex-row justify-center items-center flex-wrap md:gap-4">
            {recommendations === null ? 
                <div className="m-4 animate-pulse rounded-md bg-muted w-[250px] h-24"></div> :
                recommendations.map((rec: any) => {
                return (
                    <div key={rec.title} className="m-1 p-1 md:m-2 md:p-2 w-full md:w-[300px] h-8 md:h-16 bg-gray-100 rounded-md justify-center items-center flex flex-row"> 
                    <a href={`/article/${rec.title}`} className="underline">{decodeURI(rec.title).replace(/_/g, ' ')}</a>
                    </div>
                )
            })}
            </div>
            </div>
            <div className="prose w-full" dangerouslySetInnerHTML={{__html: article.content}}></div>
            </div>
        </>
    )
}

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const fetchArticles = async () => {
        const res = await fetch('http://127.0.0.1:8000/api/get-all-articles');
        const data = await res.json();
        setArticles(data);
    }
    const [articleUrl, setArticleUrl] = useState('');
    useEffect(() => {
        fetchArticles();
    }, []);
    const handleAddArticle = async (e: any) => {
        e.preventDefault();
        await fetch('http://127.0.0.1:8000/api/add-article/?url=' + articleUrl)
            .then((res) => res.json())
            .then((data) => {
                if(data.error === undefined){
                    alert(data.message);
                }else{
                    alert(data.error);
                }
            });

        const data = await res.json();
        if(data.message === 'Article already exists') {
            alert('Article already exists');
        }
        if(data.message === 'Article added successfully') {
            alert('Article added successfully');
        }
        setArticleUrl('');

    }
    return (
        <div className="m-4 gap-4">
            <p className="md:text-4xl font-extrabold my-4">All Articles</p>
            <form onSubmit={handleAddArticle} className="flex flex-col gap-4">
                <label htmlFor="articleUrl">Add an article</label>
                <input 
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Enter the URL of the article"
                type="text" id="articleUrl" value={articleUrl} onChange={(e) => setArticleUrl(e.target.value)} />
                <button 
                className="p-2 bg-blue-500 text-white rounded-md"
                type="submit">Add Article</button>
                
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map((article: any) => {
                    return (
                        <div key={article.title} className="bg-gray-100 p-4">
                            <a href={`/article/${article.title}`} className="underline text-xl">{decodeURI(article.title).replace(/_/g, ' ')}</a>
                            <p>{article.description}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Article;
export { ArticleList };
