import { FunctionComponent } from "preact";
import ThemeSwitch from "../components/ThemeSwitch";

const DefaultLayout: FunctionComponent<{ children: JSX.Element | JSX.Element[] }> = ({ children }) => {
  return (
    <>
      <ThemeSwitch />
      <main className="flex min-h-screen justify-center items-center flex-col dark:bg-gray-900">
        {children}
      </main>
    </>
  )
}

export default DefaultLayout
