import React, { useEffect, useState } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/accordion"
import { CopyBlock, dracula } from 'react-code-blocks'


function BubbleSortAlgorithm() {
  const codeSnippet = `function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }`;
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
    console.log("Handling submit");
    let newSteps: any[] = []; // Initialize an empty array to store steps
    let arr = toIntArray(numbers); // Convert input numbers to an integer array
    let n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          let temp = JSON.parse(JSON.stringify(arr));
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap the elements
          newSteps.push({ key: `${i},${j}`, value: [...arr], i, j ,beforeSwap: temp}); // Add current state of array to newSteps
          console.log("Step added:", newSteps);
        }
      }
    }

    // Update steps state after processing is complete
    setSteps(newSteps);
    console.log("Final steps:", newSteps);
    console.log("Sorted array:", arr);
  };

  return (
    <div className='m-4 gap-4 justify-center items-center flex flex-col'>
      <div className="w-[80%]">
        <h1 className="text-2xl font-bold">Bubble Sort</h1>
        <p className='text-xl my-2 prose'><a href='https://en.wikipedia.org/wiki/Bubble_sort'>:    Explanation</a></p>
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
          <table className="border-collapse font-mono my-4 border border-slate-400 w-full shadow-lg rounded-md">
            <thead>
              <tr className="bg-slate-600 text-white">
                <th className="px-4 py-2 border border-slate-400">[i,j]</th>
                <th className="px-4 py-2 border border-slate-400">Array Before Swap</th>

                <th className="px-4 py-2 border border-slate-400">Array after Swap</th>
              </tr>
            </thead>
            <tbody>
              {steps.length > 0 &&
                steps.map((step: any, index: number) => {
                  console.log(`debugging step`, step);
                  return (
                    <tr key={index} className="odd:bg-slate-100 even:bg-slate-200 hover:bg-slate-300 transition duration-200">
                      <td className="px-4 py-2 border border-slate-400 text-center">{step.key}</td>
                      <td className="px-4 py-2 border border-slate-400">
                        {step.beforeSwap.map((val: number, idx: number) => {
                          return idx === step.j || idx === step.j + 1 ? (
                            <span key={idx} className="bg-yellow-300 px-1 font-bold rounded-sm shadow-sm">
                              {val}
                            </span>
                          ) : (
                            <span key={idx} className="px-1 text-slate-700">
                              {val}
                            </span>
                          );
                        })}
                      </td>
                      <td className="px-4 py-2 border border-slate-400">
                        {step.value.map((val: number, idx: number) => {
                          return idx === step.j || idx === step.j + 1 ? (
                            <span key={idx} className="bg-yellow-300 px-1 font-bold rounded-sm shadow-sm">
                              {val}
                            </span>
                          ) : (
                            <span key={idx} className="px-1 text-slate-700">
                              {val}
                            </span>
                          );
                        })}
                      </td>
                      
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

export default BubbleSortAlgorithm