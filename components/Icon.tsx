/* eslint-disable react/jsx-no-target-blank */
import { FunctionComponent, useState } from "react"
import { Popover } from "react-tiny-popover"

const Icon: FunctionComponent<{ children: JSX.Element, link: string, text: string }> = ({ children, link, text }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={["top"]}
      content={
        <div data-popover id="popover-default" role="tooltip" className="text-md text-gray-700 bg-white rounded-lg border border-gray-200 shadow-sm dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
          <div className="py-2 px-3">
            <p>{text}</p>
          </div>
          <div data-popper-arrow></div>
        </div>
      }
      padding={5}
    >
      <a
        onMouseEnter={() => setIsPopoverOpen(true)}
        onMouseLeave={() => setIsPopoverOpen(false)}
        href={link}
        target="_blank"
        rel="author"
        className="hover:text-primary-700 p-1"
        data-popover-target="popover-default"
      >
        {children}
      </a>
    </Popover>
  )
}

export default Icon
