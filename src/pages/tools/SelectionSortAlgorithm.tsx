import React, { useState } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/accordion"
import { CopyBlock, dracula } from 'react-code-blocks'

function SelectionSortAlgorithm() {
    const codeSnippet = `let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let min_idx = i;

        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
            
                min_idx = j;
            }
        }
        let temp = arr[i];
        arr[i] = arr[min_idx];
        arr[min_idx] = temp;
}`
    const [numbers, setNumbers] = useState("")
    const [steps, setSteps] = useState([])
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
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('handling submit')
        let newSteps = [];
        let arr = toIntArray(numbers);
        let n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            let min_idx = i;

            for (let j = i + 1; j < n; j++) {
                if (arr[j] < arr[min_idx]) {
                    min_idx = j;
                    console.log(newSteps)
                }
            }
            let beforeSwap = JSON.parse(JSON.stringify(arr));
            let temp = arr[i];
            arr[i] = arr[min_idx];
            arr[min_idx] = temp;
            newSteps.push({ "i": arr[min_idx], "min_val": arr[i], "arr": arr, "beforeSwap": beforeSwap })
            console.log(arr);
        }
        setSteps(newSteps);
        console.log(steps, "steps")
    }
    return (
        <div className='m-4 gap-4 justify-center items-center flex flex-col'>
            <div className="w-[80%]">
                <h1 className="text-2xl font-bold">Selection Sort</h1>
                <p className='text-xl my-2 prose'><a href='https://en.wikipedia.org/wiki/Selection_sort'>:    Explanation</a></p>
                <Accordion type="single" collapsible className="" defaultValue={'item-1'}>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-2xl font-bold">Algorithm?</AccordionTrigger>
                        <AccordionContent className='font-mono w-full'>

                            <CopyBlock
                                text={codeSnippet}
                                language="JavaScript"
                                theme={dracula}
                                codeBlock></CopyBlock>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <form className='flex flex-col gap-2 w-96'>
                    Array (comma seperated): <input type="text" name="arr" id="arr" className='border p-2 rounded-md' onChange={(e) => { setNumbers(e.target.value) }} />
                    <button type='button' className='bg-blue-500 text-white p-2 rounded-md' onClick={(event) => { handleSubmit(event) }}>Calculate</button>
                </form>
                <div id="output">
                    <table className='border-collapse font-mono my-4 border border-slate-400 w-full'>
                        <thead>
                            <tr>
                                <th className="px-2 border border-slate-400">Min</th>
                                <th className="px-2 border border-slate-400">I</th>
                                <th className="px-2 border border-slate-400">Before Swap Array</th>
                                <th className="px-2 border border-slate-400">After Swap Array</th>
                            </tr>
                        </thead>
                        <tbody>
                            {steps.length > 0 && steps.map((step: any, index: number) => {
                                console.log(`debugging step`, step)
                                return (
                                    <tr key={index}>
                                        <td className="px-2 mx-2 border border-slate-400">{step.min_val}</td>
                                        <td className="px-2 mx-2 border border-slate-400">{step.i}</td>
                                        <td className="px-2 mx-2 border border-slate-400">{step.beforeSwap.map(
                                            (val, index) => {
                                                return val === step.i || val === step.min_val ? (
                                                    <span className="bg-yellow-300 px-1 font-bold rounded-sm shadow-sm">
                                                        {val}
                                                    </span>
                                                ) : (
                                                    <span className="px-1 text-slate-700">
                                                        {val}
                                                    </span>
                                                );
                                            }
                                        )}</td>
                                        <td className="px-2 mx-2 border border-slate-400">{step.arr.map(
                                            (val, index) => {
                                                return val === step.i || val === step.min_val ? (
                                                    <span className="bg-yellow-300 px-1 font-bold rounded-sm shadow-sm">
                                                        {val}
                                                    </span>
                                                ) : (
                                                    <span className="px-1 text-slate-700">
                                                        {val}
                                                    </span>
                                                );
                                            }
                                        )}</td>
                                    </tr>
                                );
                            })}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default SelectionSortAlgorithm