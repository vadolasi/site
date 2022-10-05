import { FunctionComponent } from "preact";
import ThemeSwitch from "../components/ThemeSwitch";

const DefaultLayout: FunctionComponent<{ children: JSX.Element | JSX.Element[] }> = ({ children }) => {
  return (
    <>
      <ThemeSwitch />
      <main className="flex w-screen min-h-screen justify-center items-center flex-col bg-gray-100 dark:bg-gray-900">
        {children}
      </main>
    </>
  )
}

export default DefaultLayout
