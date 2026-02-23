import { useForm } from '@inertiajs/react';
import React from 'react';


export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        image: '',
        your_self: '',
    });

    function handleSubmit(e: React.FormEvent) {
        console.log(data);
        e.preventDefault();
        post(route('admin.register.post'));
    }
    return (
        <div>
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-md  my-20">
                    <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
                        Register
                    </h2>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="file"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Image
                            </label>
                            <input
                                type="file"
                                id="file"
                                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-secondary focus:outline-none"
                            />
                            {/* error message (optional) */}
                            <p className="mt-1 text-sm text-red-500">{errors.image}</p>

                            {/* hint text */}
                            <p className="mt-1 text-xs text-gray-500">
                                Maximum file size: 256 MB
                            </p>
                        </div>
                        <div>
                            <label
                                htmlFor="username"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                User Name
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-secondary focus:outline-none"
                                placeholder="Enter Your Username"
                                onChange={(e) =>
                                    setData('username', e.target.value.trim())
                                }
                            />
                            <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                        </div>
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-secondary focus:outline-none"
                                placeholder="Enter Your Name"
                                onChange={(e) =>
                                    setData('name', e.target.value.trim())
                                }
                            />
                            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                        </div>
                        <div>
                            <label
                                htmlFor="phone"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                License number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-secondary focus:outline-none"
                                placeholder="Enter Your License number"
                                onChange={(e) =>
                                    setData('phone', e.target.value.trim())
                                }
                            />
                            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                        </div>
                        <div>
                            <label
                                htmlFor="your_self"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                About Youself
                            </label>
                            <textarea
                                name=""
                                id=""
                                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-secondary focus:outline-none"
                                onChange={(e) =>
                                    setData('your_self', e.target.value.trim())
                                }
                            ></textarea>

                            <p className="mt-1 text-sm text-red-500">{errors.your_self}</p>
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-secondary focus:outline-none"
                                placeholder="Enter Your Email"
                                onChange={(e) =>
                                    setData('email', e.target.value.trim())
                                }
                            />
                            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-secondary focus:outline-none"
                                placeholder="••••••••"
                                onChange={(e) =>
                                    setData('password', e.target.value.trim())
                                }
                            />
                            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Confrim Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-secondary focus:outline-none"
                                placeholder="••••••••"
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value.trim(),
                                    )
                                }
                            />
                            <p className="mt-1 text-sm text-red-500">{errors.password_confirmation}</p>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-secondary"
                            />
                            <label
                                htmlFor="rememberMe"
                                className="ml-2 block text-sm text-gray-700"
                            >
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-md bg-secondary px-4 py-3 text-white transition-colors hover:bg-primary focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:outline-none"
                        >
                            Register
                        </button>
                    </form>

                    {/* <div className="mt-6 text-center">
                        <a
                            href=""
                            className="text-sm text-gray-600 hover:text-gray-800"
                        >
                            Singn Up
                        </a>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
