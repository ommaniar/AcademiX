import React, { useState } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/accordion"

// creating a class for knapsack item


function FractionalKnapsack() {
    const codeSnippet = `class Item {
  constructor(value, weight) {
    this.value = value;
    this.weight = weight;
    this.ratio = value / weight; // Value-to-weight ratio
  }
}

function fractionalKnapsack(items, capacity) {
  // Sort items based on their value-to-weight ratio in descending order
  items.sort((a, b) => b.ratio - a.ratio);

  let totalValue = 0; // Total value of the knapsack
  let remainingCapacity = capacity;

  for (const item of items) {
    if (item.weight <= remainingCapacity) {
      // Take the whole item
      totalValue += item.value;
      remainingCapacity -= item.weight;
    } else {
      // Take the fraction of the item that fits
      totalValue += item.ratio * remainingCapacity;
      break; // Knapsack is full
    }
  }

  return totalValue;
}

// Example usage
const items = [
  new Item(60, 10),
  new Item(100, 20),
  new Item(120, 30)
];
const capacity = 50;

const maxValue = fractionalKnapsack(items, capacity);
console.log("Maximum value in knapsack:", maxValue);
`
    const [numbers, setNumbers] = useState([]);
    const [weights, setWeights] = useState("");
    const [profits, setProfits] = useState("");
    const [capacity, setCapacity] = useState(0);
    const [displayError, setDisplayError] = useState(false)
    const [finalProfit,setFinalProfit ] = useState()
    const [solutionTable, setSolutionTable] = useState([])
    const [arrangedArray, setArrangedArray] = useState([])

    class Item {
        constructor(profit, weight) {
            this.profit = profit;
            this.weight = weight;
            this.ratio = profit / weight
        }
    }
    function toIntArray(intString: string) {
        const strArray = intString.split(','); // Splitting the string into an array
        const intArray = strArray.map(num => {
            try {
                const parsed = parseInt(num.trim(), 10);
                if (isNaN(parsed)) {
                    throw new Error(`Invalid number: "${num.trim()}"`);
                }
                return parsed;
            } catch (error: Error) {
                console.error(error.message);
                return null; // or handle it as needed
            }
        });

        return intArray;
    }
    const FractionalKnapsack = (W, arr: Array<Item>) => {
        // W = total Weight capacity
        // arr = array of Items
        console.log(arr[0])
        arr.sort((a, b) => b.ratio - a.ratio);
        let finalvalue = 0.0;

        for (let i = 0; i < arr.length; i++) {
            if (arr[i].weight <= W) {
                W -= arr[i].weight;
                finalvalue += arr[i].profit;
            } else {
                finalvalue += arr[i].profit * (W / arr[i].weight);
                break;
            }
        }
        return finalvalue
    }
    const handleSubmit = (e: Event) => {
        e.preventDefault()
        let weight_arr = toIntArray(weights);
        let profit_arr = toIntArray(profits);
        if (weight_arr.length == profit_arr.length){
            setDisplayError(false)
            let items = []
            for (let i = 0; i < weight_arr.length; i++) {
              items.push(new Item(profit_arr[i],weight_arr[i]));
            }
            let max_profit = FractionalKnapsack(capacity,items);
            console.log(max_profit);   
            setFinalProfit(max_profit);
        }else{
            setFinalProfit(null);
            setDisplayError("Both Weights and profits needs to be having same length")
        }
    }

    return (

        <div className='m-4 gap-4 justify-center items-center flex flex-col'>
            <div className="w-[80%]">
                <h1 className="text-2xl font-bold">Fractional Knapsack Problem (Greedy)</h1>
                <p className='text-xl my-2 prose'><a href='https://en.wikipedia.org/wiki/Knapsack_problem'>:    Explanation</a></p>
                <Accordion type="single" collapsible className="" defaultValue={'item-1'}>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-2xl font-bold">Algorithm?</AccordionTrigger>
                        <AccordionContent className='prose text-lg w-full'>
                            <div className="p-4 bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-full">
                                <pre className="overflow-auto p-3 bg-gray-800 rounded-lg text-sm">
                                    <code>{codeSnippet}</code>
                                </pre>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <form className='flex flex-col gap-2 w-96'>
                    Weights (comma seperated): <input type="text" name="weights" id="weights" required className='border p-2 rounded-md' onChange={(e) => { setWeights(e.target.value) }} />
                    Profits (comma seperated): <input type="text" name="profits" id="profits" required className='border p-2 rounded-md' onChange={(e) => { setProfits(e.target.value) }} />
                    Capacity: <input type="number" name="capacity" id="capacity"required  className='border p-2 rounded-md' onChange={(e) => { setCapacity(parseInt(e.target.value)) }} />
                    <p className='text-xs'>Make sure that number of weights and profits are equal otherwise a error will be shown.</p>
                    <button type='button' className='bg-blue-500 text-white p-2 rounded-md' onClick={(e) => { handleSubmit(e) }}>Calculate</button>
                    
                    {displayError?( <div className='bg-red-200 text-red-600 p-3 rounded-md'>
                        {displayError && displayError}
                    </div>):null}
                </form>
                <div>
                {finalProfit && finalProfit}
                </div>
            </div>
        </div>
    )
}

export default FractionalKnapsack