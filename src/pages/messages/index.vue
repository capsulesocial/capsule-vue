<template>
  <section
    :class="
      this.$store.state.settings.darkMode
        ? 'text-lightPrimaryText bg-lightBG'
        : 'text-darkPrimaryText bg-darkBG'
    "
  >
    <!-- component -->
    <div class="flex flex-row h-screen">
      <div class="flex flex-row w-96 flex-shrink-0 p-4">
        <div class="flex flex-col w-full h-full pl-4 pr-4 py-4 -mr-4">
          <div class="flex flex-row items-center">
            <div class="flex flex-row items-center">
              <div class="text-xl font-semibold">
                Messages
              </div>
              <div
                class="flex items-center justify-center ml-2 text-xs h-5 w-5 text-white bg-red-500 rounded-full font-medium"
              >
                5
              </div>
            </div>
            <div class="ml-auto">
              <button
                class="flex items-center justify-center h-7 w-7 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-mail"
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  ></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </button>
            </div>
          </div>
          <div class="mt-2">
            <div class="flex flex-col -mx-4">
              <div class="relative flex flex-row items-center p-4">
                <div
                  class="absolute text-xs text-gray-500 right-0 top-0 mr-4 mt-3"
                >
                  5 min
                </div>
                <img class="w-10 h-10 rounded-lg flex-shrink-0 m-2" />
                <div class="flex flex-col flex-grow ml-3">
                  <div class="text-sm font-medium">
                    Jack Dishman
                  </div>
                  <div class="text-xs truncate w-40">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Debitis, doloribus?
                  </div>
                </div>
                <div class="flex-shrink-0 ml-2 self-end mb-1">
                  <span
                    class="flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs rounded-full"
                  >5</span>
                </div>
              </div>
              <div
                class="flex flex-row items-center p-4 bg-gradient-to-r from-red-100 to-transparent border-l-2 border-red-500"
              >
                <img class="w-10 h-10 rounded-lg flex-shrink-0 m-2" />
                <div class="flex flex-col flex-grow ml-3">
                  <div class="flex items-center">
                    <div class="text-sm font-medium">
                      Jack Dishman
                    </div>
                    <div class="h-2 w-2 rounded-full bg-green-500 ml-2"></div>
                  </div>
                  <div class="text-xs truncate w-40">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Debitis, doloribus?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col h-full w-full px-4 py-6">
        <!-- Header for selected chat -->
        <div class="p-4 border-b flex">
          <img class="w-10 h-10 rounded-lg" />
          <span class="pl-2">
            <h4 class="text-lg font-bold">Jack Dishman</h4>
            <h6 class="text-xs">Last seen today</h6>
          </span>
        </div>
        <div class="h-full overflow-hidden py-4">
          <div class="h-full overflow-y-auto">
            <!-- Message #1 -->
            <div class="flex items-end p-4">
              <img class="w-10 h-10 rounded-lg flex-shrink-0 m-2" />
              <div class="m-2 pt-4 px-2 border rounded-lg">
                <p>
                  Hey! How are you? It's been a while since we last spoke. I saw
                  your Capsule post and want to hear more about your thoughts on
                  Pangea.
                </p>
                <h6 class="text-xs text-right p-4">
                  10:00 AM
                </h6>
              </div>
            </div>

            <!-- Message #2 -->
            <div class="flex flex-row-reverse items-end">
              <img class="w-10 h-10 rounded-lg flex-shrink-0 m-2" />
              <div class="m-2 pt-4 px-2 border rounded-lg">
                <p>
                  Pangea is a mindset.
                </p>
                <h6 class="text-xs text-right p-4">
                  10:03 AM
                </h6>
              </div>
            </div>
            <!-- Message #3 -->
            <div class="flex flex-row-reverse items-end">
              <img class="w-10 h-10 rounded-lg flex-shrink-0 m-2" />
              <div class="m-2 pt-4 px-2 border rounded-lg">
                <p>
                  Do you know what I mean?
                </p>
                <h6 class="text-xs text-right p-4">
                  10:03 AM
                </h6>
              </div>
            </div>
            <!-- Message #4 -->
            <div class="flex items-end p-4">
              <img class="w-10 h-10 rounded-lg flex-shrink-0 m-2" />
              <div class="m-2 pt-4 px-2 border rounded-lg">
                <p>
                  No clue what you're talking about, bro....
                </p>
                <h6 class="text-xs text-right p-4">
                  10:43 AM
                </h6>
              </div>
            </div>
            <!-- Message #5 -->
            <div class="flex items-end p-4">
              <img class="w-10 h-10 rounded-lg flex-shrink-0 m-2" />
              <div class="m-2 pt-4 px-2 border rounded-lg">
                <p>
                  But I respect your opinion!
                </p>
                <h6 class="text-xs text-right p-4">
                  10:00 AM
                </h6>
              </div>
            </div>
          </div>
        </div>
        <!-- Start of comment bar -->
        <div class="flex flex-row items-center">
          <div
            class="flex flex-row items-center w-full border rounded-3xl h-10 px-2"
          >
            <button
              class="flex items-center justify-center h-10 w-10 text-gray-400 ml-1"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                ></path>
              </svg>
            </button>
            <div class="w-full">
              <input
                type="text"
                :class="
                  this.$store.state.settings.darkMode
                    ? 'text-lightPrimaryText bg-lightBG border-lightBorder'
                    : 'text-darkPrimaryText bg-darkBG border-darkBorder'
                "
                class="border-t border-b w-full focus:outline-none text-sm h-10 flex items-center"
                placeholder="Type your message...."
              />
            </div>
            <div class="flex flex-row">
              <button
                class="flex items-center justify-center h-10 w-8 text-gray-400"
              ></button>
              <button
                class="flex items-center justify-center h-10 w-8 text-gray-400 ml-1 mr-2"
              >
                <svg
                  class="w-5 h-5 transform rotate-90 -mr-px"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
	layout: `Messages`,
})
</script>
