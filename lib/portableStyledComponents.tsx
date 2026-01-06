import { PortableTextComponents } from "@portabletext/react";

export const components: PortableTextComponents = {
  types: {
    link: ({ value }) => (
      <a
        href={value.href}
        className="text-blue-500 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {value.children[0].text}
      </a>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-semibold my-6" > {children} </h1>,
    h2: ({ children }) => <h2 className="text-3xl font-semibold my-5" > {children} </h2>,
    h3: ({ children }) => <h3 className="text-2xl font-medium my-4" > {children} </h3>,
    h4: ({ children }) => <h4 className="text-xl font-medium my-3" > {children} </h4>,
    h5: ({ children }) => <h5 className="text-lg font-medium my-2" > {children} </h5>,
    h6: ({ children }) => <h6 className="text-base font-medium my-1" > {children} </h6>,
    blockquote: ({ children }) => (
      <blockquote className="italic border-l-4 pl-4 my-6" > {children} </blockquote>
    ),
    normal: ({ children }) => <p className="text-lg my-4" > {children} </p>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-5 my-4" > {children} </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-5 my-4" > {children} </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold" > {children} </strong>
    ),
    em: ({ children }) => <em className="italic" > {children} </em>,
    link: ({ children }) => <a className="text-blue-500 underline" > {children} </a>,
  },
};

