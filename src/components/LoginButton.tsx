import { Dialog, Popover, Transition } from "@headlessui/react";
import { useCallback, Fragment, useState, useEffect, useRef } from "react";
import { supabase } from "../auth/client";
import { useUserStore } from "../stores/user";

export const LoginButton = () => {
  const [user, setUser] = useUserStore();
  const [email, setEmail] = useState({ value: "", valid: false });
  const [loading, setLoading] = useState(false);
  const [onClient, setOnClient] = useState(false);
  let closeRef = useRef<() => void>();
  useEffect(() => {
    setOnClient(true);
  }, []);
  const onClick = useCallback(async () => {
    if (user != null) {
      // logout
      try {
        setLoading(true);
        await supabase.auth.signOut();
        setUser(undefined);
      } finally {
        setLoading(false);
      }
    } else if (email.valid) {
      try {
        setLoading(true);
        const result = await supabase.auth.signInWithOtp({
          email: email.value,
          options: {
            emailRedirectTo: "https://jeddahmeetup.tech/",
          },
        });
        console.log("result", result);
        if (result.data.user != null) {
          setUser(result.data.user);
        }
      } finally {
        closeRef.current?.();
        setLoading(false);
      }
    }
  }, [user, email]);
  console.log({ user: !!user, onClient });
  if (user == null && onClient) {
    return (
      <Popover className="relative">
        {({ open, close }) => {
          if (closeRef.current !== close) {
            closeRef.current = close;
          }
          return (
            <>
              <Popover.Button className="block font-semibold text-sm text-center py-3 px-4 text-white bg-[#72389c] hover:bg-[#8d55b5] duration-150 rounded-lg shadow md:px-2 md:py-2 lg:px-4">
                تسجيل الدخول
              </Popover.Button>
              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute left-0 z-10 mt-3 w-64 max-w-sm transform px-4 sm:px-0 lg:max-w-3xl">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-8 bg-[#f5e8ff] p-7">
                      <div>
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gray-700 text-start"
                        >
                          البريد الالكتروني
                        </label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                          <input
                            type="email"
                            name="price"
                            id="price"
                            className="block w-full rounded-md border-gray-300 px-4 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="user@example.com"
                            value={email.value}
                            onChange={(e) =>
                              setEmail({
                                value: e.currentTarget.value,
                                valid: e.currentTarget.validity.valid,
                              })
                            }
                          />
                        </div>
                      </div>
                      <button
                        onClick={onClick}
                        className="block font-semibold text-sm text-center py-3 px-4 text-white bg-[#72389c] hover:bg-[#8d55b5] duration-150 rounded-lg shadow md:px-2 md:py-2 lg:px-4 disabled:bg-[#e2caf3]"
                        disabled={!email.valid || loading}
                      >
                        تسجيل
                      </button>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          );
        }}
      </Popover>
    );
  }
  return (
    <button
      onClick={onClick}
      className="block font-semibold text-sm text-center py-3 px-4 text-white bg-[#72389c] hover:bg-[#8d55b5] duration-150 rounded-lg shadow md:px-2 md:py-2 lg:px-4"
    >
      {user != null ? "تسجيل الخروج" : "تسجيل الدخول"}
    </button>
  );
};
