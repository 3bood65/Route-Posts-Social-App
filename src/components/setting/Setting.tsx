import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/react";
import { AuthContext } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const zodSchema = zod
  .object({
    password: zod
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password must be at most 20 characters long")
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    newPassword: zod
      .string()
      .nonempty("New password is required")
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password must be at most 20 characters long")
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    rePassword: zod
      .string()
      .nonempty("Password confirmation is required")
      .regex(
        passwordRegex,
        "Passwords do not match",
      ),
  })
  .refine(
    (obj) => obj.newPassword === obj.rePassword,
    {
      path: ["rePassword"],
      message: "Passwords do not match",
    },
  );

type ChangePasswordValues = zod.infer<typeof zodSchema>;

export default function Setting() {
  const navigate = useNavigate();
  const { setUserToken } = useContext(AuthContext);

  const logout = function () {
    localStorage.removeItem("userToken");
    navigate("/login");
    setUserToken(null);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isResponseSuccess, setIsResponseSuccess] = useState<string | null>(null);

  async function handleChangePassword(values: ChangePasswordValues) {
    setIsLoading(true);
    const payload = {
      password: values.password,
      newPassword: values.newPassword,
    };

    await axios
      .patch(
        "https://route-posts.routemisr.com/users/change-password",
        payload,
        {
          headers: {
            AUTHORIZATION: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      )
      .then(() => {
        setIsResponseSuccess("Password changed successfully!");
        setTimeout(() => {
          setIsResponseSuccess(null);
          logout();
        }, 4000);
      })
      .catch((error) => {
        setErrorMessage(
          error.response?.data?.message || "Something went wrong",
        );
        setTimeout(() => setErrorMessage(null), 4000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const { handleSubmit, register, formState } = useForm<ChangePasswordValues>({
    resolver: zodResolver(zodSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      rePassword: "",
    },
    mode: "onBlur",
  });

  return (
    <>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <div className='relative z-10 w-full min-h-[calc(100vh-4rem)] backdrop-blur-md border border-white/20 shadow-2xl bg-gray-200 rounded-3xl p-8 space-y-6 flex justify-center items-center'>
        <div className='w-full max-w-2xl mx-auto p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 bg-white'>
          <div className='w-4/5 mx-auto flex items-center gap-2 '>
            <span className='bg-blue-300 rounded-4xl p-3 flex justify-center items-center max-w-fit'>
              <i className='fa-solid fa-key text-3xl text-white'></i>
            </span>
            <h1 className='text-center text-4xl font-bold'>Change Password</h1>
          </div>

          {errorMessage && (
            <div className='rounded-2xl border border-red-200 bg-red-50/90 p-3 text-center text-xs font-semibold text-red-600 mt-4'>
              {errorMessage}
            </div>
          )}

          {isResponseSuccess && (
            <div className='rounded-2xl border border-emerald-200 bg-emerald-50/90 p-3 text-center text-xs font-semibold text-emerald-600 mt-4'>
              {isResponseSuccess}
            </div>
          )}

          <Form
            className='flex flex-col gap-2 w-full mt-2'
            onSubmit={handleSubmit(handleChangePassword)}
          >
            <div className='w-full'>
              <Input
                label='Current Password'
                classNames={{
                  inputWrapper: "border border-slate-200 bg-slate-50/50 mt-1",
                }}
                labelPlacement='outside'
                radius='md'
                type='password'
                {...register("password")}
              />

              {formState.touchedFields.password &&
                formState.errors.password && (
                  <p className='text-xs text-red-600 mt-1 pl-1'>
                    {typeof formState.errors.password.message === "string"
                      ? formState.errors.password.message
                      : ""}
                  </p>
                )}
            </div>

            <div className='w-full'>
              <Input
                classNames={{
                  inputWrapper: "border border-slate-200 bg-slate-50/50 mt-1",
                }}
                label='New Password'
                type='password'
                labelPlacement='outside'
                radius='md'
                {...register("newPassword")}
              />

              {formState.touchedFields.newPassword &&
                formState.errors.newPassword && (
                  <p className='text-xs text-red-600 mt-1 pl-1'>
                    {typeof formState.errors.newPassword.message === "string"
                      ? formState.errors.newPassword.message
                      : ""}
                  </p>
                )}
            </div>

            <div className='w-full'>
              <Input
                classNames={{
                  inputWrapper: "border border-slate-200 bg-slate-50/50 mt-1",
                }}
                label='Confirm New Password'
                labelPlacement='outside'
                radius='md'
                type='password'
                {...register("rePassword")}
              />

              {formState.touchedFields.rePassword &&
                formState.errors.rePassword && (
                  <p className='text-xs text-red-600 mt-1 pl-1'>
                    {typeof formState.errors.rePassword.message === "string"
                      ? formState.errors.rePassword.message
                      : ""}
                  </p>
                )}
            </div>

            <div className='w-full md:col-span-2 mt-2'>
              <Button
                disabled={isLoading}
                isLoading={isLoading}
                type='submit'
                className='w-full rounded-xl bg-[#6ea2f9] py-6 text-base font-bold text-white transition hover:bg-[#5a9cf8]'
              >
                Update Password
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
