import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { tclient } from "../auth/trpc-client";
import { Button } from "./button";

export const AddTopic = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const cancelButtonRef = useRef(null);
  const submitTopic = async () => {
    try {
      setLoading(true);
      const result = await tclient.topics.addTopic.mutate({
        title: topic,
      });
      if (result) {
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div>
        <Button
          onClick={() => {
            console.log("onClick");
            setIsOpen(true);
          }}
        >
          اضافة موضوع
        </Button>
      </div>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setIsOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 backdrop-blur-sm bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-neutral-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-neutral-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"></div>
                      <div className="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-start space-y-4  w-full">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-neutral-300"
                        >
                          تفاصيل الموضوع
                        </Dialog.Title>
                        <div className="mt-2">
                          <textarea
                            className="text-sm text-neutral-700 min-h-[140px] w-full rounded-md"
                            value={topic}
                            onChange={(e) => setTopic(e.currentTarget.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-neutral-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-[#8d55b5] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={submitTopic}
                      disabled={loading}
                    >
                      ارسال
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setIsOpen(false)}
                      ref={cancelButtonRef}
                      disabled={loading}
                    >
                      الغاء
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
