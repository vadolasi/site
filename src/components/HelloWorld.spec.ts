import { test, expect } from "vitest"
import { mount } from "@vue/test-utils"

import HelloWorld from "./HelloWorld.vue"

test("renders a hello world message", () => {
  const wrapper = mount(HelloWorld)

  expect(wrapper.text()).toBe("Hello world!")
})
