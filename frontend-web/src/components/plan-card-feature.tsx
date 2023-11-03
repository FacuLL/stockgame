

export default function PlanCardFeature(props: {enabled?: boolean, children: string, }) {
    return (
        <li className={`${"flex space-x-3"} ${props.enabled ? '' : 'line-through decoration-gray-500' }`}>
          <svg
            className={`${'h-5 w-5 shrink-0'} ${props.enabled ? 'text-cyan-600 dark:text-cyan-500' : 'text-gray-400 dark:text-gray-500'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">{props.children}</span>
        </li>
    )
}