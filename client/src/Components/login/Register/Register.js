import { GoogleAuthProvider } from "firebase/auth";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthProvider";
import registrationImg from "../../../images/registration-img.png";
import img from "../../../images/shijan.jpg";

const Register = () => {
  const [wrongPass, setWrongPass] = useState("");
  const [error, setError] = useState("");
  const [showpass, setShowPass] = useState(false);
  const { createUser, signInGoogle, updateUserProfile } =
    useContext(AuthContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const confirm = form.confirm.value;
    const password = form.password.value;
    const photoURL = form.photoURL.value;

    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      setError("Please add a special carecter");
      return;
    }
    if (password !== confirm) {
      setWrongPass("PassWord did not match");
      return;
    }
    createUser(email, password)
      .then((result) => {
        const user = result.user;
        setError("");
        handleUpdateProfile(name, photoURL);
        form.reset();
        localStorage.setItem("userEmail", user?.email);
        window.location.href = "/";
        toast.success("Your Account Has Created");
      })
      .catch((error) => {
        console.error("create user account error", error);
        setError(error.message);
      });
  };

  const handleUpdateProfile = (name, photoURL) => {
    const profile = {
      displayName: name,
      photoURL: photoURL,
    };
    updateUserProfile(profile)
      .then(() => {
        toast.success("Your Profile Has Created");
      })
      .catch((error) => {
        console.error("create user account error", error);
      });
  };

  const googleProvider = new GoogleAuthProvider();
  const handleGoogleSignIn = () => {
    signInGoogle(googleProvider)
      .then((result) => {
        const user = result.user;
        localStorage.setItem("userEmail", user?.email);
        window.location.href = "/";
        toast.success("Login Successfull");
      })
      .catch((error) => {
        console.error("Google User SIgn In error", error);
      });
  };

  return (
    <div>
      <div className="bg-background">
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-20 sm:gap-10 max-w-7xl mx-auto px-6 items-center py-20">
          <div className="bg-white shadow-lg rounded md:p-10 p-5">
            <p
              tabIndex={0}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-black"
            >
              Create an account
            </p>
            <p
              tabIndex={0}
              className="focus:outline-none text-sm mt-4 font-medium leading-none text-gray-500"
            >
              Already have an Account?{" "}
              <Link
                to="/"
                className="hover:text-gray-500 focus:text-gray-500 focus:outline-none focus:underline hover:underline text-sm font-medium leading-none text-gray-800 cursor-pointer"
              >
                {" "}
                Sign In here
              </Link>
            </p>
            <button
              onClick={handleGoogleSignIn}
              aria-label="Continue with google"
              className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 p-3 border rounded-lg border-gray-700 flex items-center w-full mt-10 hover:bg-gray-100"
            >
              <svg
                width={19}
                height={20}
                viewBox="0 0 19 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.9892 10.1871C18.9892 9.36767 18.9246 8.76973 18.7847 8.14966H9.68848V11.848H15.0277C14.9201 12.767 14.3388 14.1512 13.047 15.0812L13.0289 15.205L15.905 17.4969L16.1042 17.5173C17.9342 15.7789 18.9892 13.221 18.9892 10.1871Z"
                  fill="#4285F4"
                />
                <path
                  d="M9.68813 19.9314C12.3039 19.9314 14.4999 19.0455 16.1039 17.5174L13.0467 15.0813C12.2286 15.6682 11.1306 16.0779 9.68813 16.0779C7.12612 16.0779 4.95165 14.3395 4.17651 11.9366L4.06289 11.9465L1.07231 14.3273L1.0332 14.4391C2.62638 17.6946 5.89889 19.9314 9.68813 19.9314Z"
                  fill="#34A853"
                />
                <path
                  d="M4.17667 11.9366C3.97215 11.3165 3.85378 10.6521 3.85378 9.96562C3.85378 9.27905 3.97215 8.6147 4.16591 7.99463L4.1605 7.86257L1.13246 5.44363L1.03339 5.49211C0.37677 6.84302 0 8.36005 0 9.96562C0 11.5712 0.37677 13.0881 1.03339 14.4391L4.17667 11.9366Z"
                  fill="#FBBC05"
                />
                <path
                  d="M9.68807 3.85336C11.5073 3.85336 12.7344 4.66168 13.4342 5.33718L16.1684 2.59107C14.4892 0.985496 12.3039 0 9.68807 0C5.89885 0 2.62637 2.23672 1.0332 5.49214L4.16573 7.99466C4.95162 5.59183 7.12608 3.85336 9.68807 3.85336Z"
                  fill="#EB4335"
                />
              </svg>
              <p className="text-base font-medium ml-4 text-gray-700">
                Continue with Google
              </p>
            </button>

            <div className="w-full flex items-center justify-between py-5">
              <hr className="w-full bg-gray-400" />
              <p className="text-base font-medium leading-4 px-2.5 text-gray-500">
                OR
              </p>
              <hr className="w-full bg-gray-400" />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mt-6 w-full">
                <label
                  htmlFor="name"
                  className="text-sm font-medium leading-none text-gray-800"
                >
                  {" "}
                  Name{" "}
                </label>
                <input
                  name="name"
                  id="name"
                  aria-labelledby="name"
                  type="text"
                  className="bg-gray-200 border rounded text-xs font-medium leading-none placeholder-gray-800 text-gray-800 py-3 w-full pl-3 mt-2 "
                  placeholder="e.g: Md Shijan Ali "
                  required
                />
              </div>
              <div className="mt-6 w-full">
                <label
                  htmlFor="photoURL"
                  className="text-sm font-medium leading-none text-gray-800"
                >
                  {" "}
                  Select Image{" "}
                </label>{" "}
                <br />
                <input
                  className="mt-2 border p-2 w-full bg-gray-200"
                  type="file"
                  id="photoURL"
                  name="photoURL"
                  accept="image/*"
                  required
                />
              </div>
              <div className="mt-6 w-full">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none text-gray-800"
                >
                  {" "}
                  Email{" "}
                </label>
                <input
                  name="email"
                  id="email"
                  aria-labelledby="email"
                  type="email"
                  className="bg-gray-200 border rounded text-xs font-medium leading-none placeholder-gray-800 text-gray-800 py-3 w-full pl-3 mt-2"
                  placeholder="e.g: john@gmail.com "
                  required
                />
              </div>
              <div className="mt-6 w-full">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none text-gray-800"
                >
                  {" "}
                  Password{" "}
                </label>
                <div className="relative flex items-center justify-center">
                  <input
                    name="password"
                    id="password"
                    type={showpass ? "text" : "password"}
                    className="bg-gray-200 border rounded text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                    required
                  />
                  <div
                    onClick={() => setShowPass(!showpass)}
                    className="absolute right-0 mt-2 mr-3 cursor-pointer"
                  >
                    <div id="show">
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.99978 2C11.5944 2 14.5851 4.58667 15.2124 8C14.5858 11.4133 11.5944 14 7.99978 14C4.40511 14 1.41444 11.4133 0.787109 8C1.41378 4.58667 4.40511 2 7.99978 2ZM7.99978 12.6667C9.35942 12.6664 10.6787 12.2045 11.7417 11.3568C12.8047 10.509 13.5484 9.32552 13.8511 8C13.5473 6.67554 12.8031 5.49334 11.7402 4.64668C10.6773 3.80003 9.35864 3.33902 7.99978 3.33902C6.64091 3.33902 5.32224 3.80003 4.25936 4.64668C3.19648 5.49334 2.45229 6.67554 2.14844 8C2.45117 9.32552 3.19489 10.509 4.25787 11.3568C5.32085 12.2045 6.64013 12.6664 7.99978 12.6667ZM7.99978 11C7.20413 11 6.44106 10.6839 5.87846 10.1213C5.31585 9.55871 4.99978 8.79565 4.99978 8C4.99978 7.20435 5.31585 6.44129 5.87846 5.87868C6.44106 5.31607 7.20413 5 7.99978 5C8.79543 5 9.55849 5.31607 10.1211 5.87868C10.6837 6.44129 10.9998 7.20435 10.9998 8C10.9998 8.79565 10.6837 9.55871 10.1211 10.1213C9.55849 10.6839 8.79543 11 7.99978 11ZM7.99978 9.66667C8.4418 9.66667 8.86573 9.49107 9.17829 9.17851C9.49085 8.86595 9.66644 8.44203 9.66644 8C9.66644 7.55797 9.49085 7.13405 9.17829 6.82149C8.86573 6.50893 8.4418 6.33333 7.99978 6.33333C7.55775 6.33333 7.13383 6.50893 6.82126 6.82149C6.5087 7.13405 6.33311 7.55797 6.33311 8C6.33311 8.44203 6.5087 8.86595 6.82126 9.17851C7.13383 9.49107 7.55775 9.66667 7.99978 9.66667Z"
                          fill="#71717A"
                        />
                      </svg>
                    </div>
                    <div id="hide" className="hidden">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-eye-off"
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#27272A"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <line x1={3} y1={3} x2={21} y2={21} />
                        <path d="M10.584 10.587a2 2 0 0 0 2.828 2.83" />
                        <path d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-lg text-red-700"> </p>
              <div className="mt-6 w-full">
                <label
                  htmlFor="confirm"
                  className="text-sm font-medium leading-none text-gray-800"
                >
                  {" "}
                  Confirm Password{" "}
                </label>
                <div className="relative flex items-center justify-center">
                  <input
                    name="confirm"
                    id="confirm"
                    type={showpass ? "text" : "password"}
                    className="bg-gray-200 border rounded text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                    required
                  />
                  <div
                    onClick={() => setShowPass(!showpass)}
                    className="absolute right-0 mt-2 mr-3 cursor-pointer"
                  >
                    <div id="show">
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.99978 2C11.5944 2 14.5851 4.58667 15.2124 8C14.5858 11.4133 11.5944 14 7.99978 14C4.40511 14 1.41444 11.4133 0.787109 8C1.41378 4.58667 4.40511 2 7.99978 2ZM7.99978 12.6667C9.35942 12.6664 10.6787 12.2045 11.7417 11.3568C12.8047 10.509 13.5484 9.32552 13.8511 8C13.5473 6.67554 12.8031 5.49334 11.7402 4.64668C10.6773 3.80003 9.35864 3.33902 7.99978 3.33902C6.64091 3.33902 5.32224 3.80003 4.25936 4.64668C3.19648 5.49334 2.45229 6.67554 2.14844 8C2.45117 9.32552 3.19489 10.509 4.25787 11.3568C5.32085 12.2045 6.64013 12.6664 7.99978 12.6667ZM7.99978 11C7.20413 11 6.44106 10.6839 5.87846 10.1213C5.31585 9.55871 4.99978 8.79565 4.99978 8C4.99978 7.20435 5.31585 6.44129 5.87846 5.87868C6.44106 5.31607 7.20413 5 7.99978 5C8.79543 5 9.55849 5.31607 10.1211 5.87868C10.6837 6.44129 10.9998 7.20435 10.9998 8C10.9998 8.79565 10.6837 9.55871 10.1211 10.1213C9.55849 10.6839 8.79543 11 7.99978 11ZM7.99978 9.66667C8.4418 9.66667 8.86573 9.49107 9.17829 9.17851C9.49085 8.86595 9.66644 8.44203 9.66644 8C9.66644 7.55797 9.49085 7.13405 9.17829 6.82149C8.86573 6.50893 8.4418 6.33333 7.99978 6.33333C7.55775 6.33333 7.13383 6.50893 6.82126 6.82149C6.5087 7.13405 6.33311 7.55797 6.33311 8C6.33311 8.44203 6.5087 8.86595 6.82126 9.17851C7.13383 9.49107 7.55775 9.66667 7.99978 9.66667Z"
                          fill="#71717A"
                        />
                      </svg>
                    </div>
                    <div id="hide" className="hidden">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-eye-off"
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#27272A"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <line x1={3} y1={3} x2={21} y2={21} />
                        <path d="M10.584 10.587a2 2 0 0 0 2.828 2.83" />
                        <path d="M9.363 5.365a9.466 9.466 0 0 1 2.637 -.365c4 0 7.333 2.333 10 7c-.778 1.361 -1.612 2.524 -2.503 3.488m-2.14 1.861c-1.631 1.1 -3.415 1.651 -5.357 1.651c-4 0 -7.333 -2.333 -10 -7c1.369 -2.395 2.913 -4.175 4.632 -5.341" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-red-600">{error}</div>
              <div className="text-red-600">{wrongPass}</div>

              <div className="mt-8">
                <button
                  type="submit"
                  className="focus:ring-2 focus:ring-offset-2 focus:ring-primary text-sm font-semibold leading-none text-white bg-primary focus:outline-none border rounded hover:bg-primary/90 py-4 w-full transition duration-500 ease-in-out"
                >
                  Create my account
                </button>
              </div>
            </form>
          </div>
          <div className="">
            <div className="w-[80%] mx-auto">
              <img className="w-full h-full" src={registrationImg} alt="" />
            </div>
            <div className="flex items-start mt-8">
              <div>
                <svg
                  width={22}
                  height={14}
                  viewBox="0 0 22 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.0666 6.65142C15.7914 6.17428 16.6517 5.94576 17.5177 6.00035C18.3837 6.05493 19.2085 6.38965 19.8677 6.95402C20.5268 7.51839 20.9845 8.28179 21.1718 9.12907C21.3591 9.97636 21.2658 10.8616 20.906 11.6512C20.5461 12.4408 19.9393 13.092 19.177 13.5065C18.4146 13.921 17.5382 14.0764 16.6798 13.9492C15.8215 13.822 15.0277 13.4192 14.4184 12.8014C13.809 12.1836 13.4171 11.3844 13.3016 10.5244C12.9366 8.73142 12.7946 6.57642 13.5086 4.62542C14.2746 2.53542 15.9726 0.821417 19.0136 0.0254175C19.2671 -0.0328119 19.5332 0.00995174 19.7556 0.144642C19.978 0.279332 20.1392 0.495356 20.205 0.746904C20.2708 0.998453 20.2361 1.26575 20.1081 1.4921C19.9802 1.71846 19.7691 1.88608 19.5196 1.95942C17.0596 2.60342 15.9096 3.88942 15.3866 5.31342C15.2316 5.73842 15.1266 6.18742 15.0666 6.65142Z"
                    fill="#4B5563"
                  />
                  <path
                    d="M2.06664 6.65142C2.79142 6.17428 3.65171 5.94576 4.51773 6.00035C5.38375 6.05493 6.20853 6.38965 6.86766 6.95402C7.5268 7.51839 7.98454 8.28179 8.17183 9.12907C8.35912 9.97636 8.26581 10.8616 7.90597 11.6512C7.54612 12.4408 6.93927 13.092 6.17695 13.5065C5.41463 13.921 4.53818 14.0764 3.67982 13.9492C2.82145 13.822 2.02772 13.4192 1.41836 12.8014C0.808998 12.1836 0.417052 11.3844 0.301644 10.5244C-0.0633559 8.73142 -0.205356 6.57642 0.508644 4.62542C1.27464 2.53542 2.97264 0.821417 6.01364 0.0254175C6.26706 -0.0328119 6.53318 0.00995174 6.7556 0.144642C6.97801 0.279332 7.13921 0.495356 7.20502 0.746904C7.27084 0.998453 7.23609 1.26575 7.10814 1.4921C6.98019 1.71846 6.7691 1.88608 6.51964 1.95942C4.05964 2.60342 2.90964 3.88942 2.38664 5.31342C2.23164 5.73842 2.12664 6.18742 2.06664 6.65142Z"
                    fill="#4B5563"
                  />
                </svg>
              </div>
              <p className="text-xl sm:text-md md:text-xl leading-7 text-gray-600 pl-2.5">
                Generating random paragraphs can be an excellent way for writers
                to get their creative flow going at the beginning of the day.
                The writer has no idea what topic the random paragraph will be
                about when it appears
              </p>
            </div>
            <div className="flex items-center pl-8 mt-10">
              <div className="w-20 h-20  rounded-xl">
                <img src={img} alt="profilepicture" className="w-full h-full" />
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium leading-none text-gray-800">
                  Md Shijan Ali
                </p>
                <a href="https://www.facebook.com/mdshijanali135/">
                  <p className="text-sm font-medium leading-none text-gray-600 mt-1 cursor-pointer hover:underline">
                    See profile
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
