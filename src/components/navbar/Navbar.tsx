import {
  Navbar as HerouiNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { Link as LinkRouter, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Logo from "../../assets/logo.jpg";

export default function Navbar() {
  const { userToken, setUserToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = function () {
    localStorage.removeItem("userToken");
    navigate("/login");
    setUserToken(null);
  };

  const getProfileDetails = async () => {
    const res = await axios.get(
      `https://route-posts.routemisr.com/users/profile-data`,
      {
        headers: {
          AUTHORIZATION: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
    return res;
  };

  const { data: userdata } = useQuery({
    queryKey: ["getProfiledetails"],
    queryFn: getProfileDetails,
    enabled: !!userToken,
  });
  const user = userdata?.data?.data.user;

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <HerouiNavbar
        isBordered
        classNames={{
          base: "bg-white/95 backdrop-blur-sm shadow-sm border-b border-[#e4e6ea] h-14",
          wrapper: "max-w-7xl px-4",
        }}
      >
        <NavbarBrand className='flex gap-2'>
          <img
            className='w-8 h-8 rounded-xl object-cover'
            src={Logo}
            alt='Route Logo'
          />
          <p className='font-extrabold text-[#1c1e21] text-sm hidden sm:block'>
            Route Posts
          </p>
        </NavbarBrand>

        {userToken != null && (
          <NavbarContent className='gap-1' justify='center'>
            <NavbarItem>
              <LinkRouter
                to={"/"}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive("/")
                  ? "bg-[#e7f0fd] text-[#1877f2]"
                  : "text-[#65676b] hover:bg-[#f0f2f5] hover:text-[#1c1e21]"
                  }`}
              >
                <i className='fa-solid fa-house text-sm'></i>
                <span className='hidden sm:inline'>Home</span>
              </LinkRouter>
            </NavbarItem>
            <NavbarItem>
              <LinkRouter
                to={"/notifications"}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive("/notifications")
                  ? "bg-[#e7f0fd] text-[#1877f2]"
                  : "text-[#65676b] hover:bg-[#f0f2f5] hover:text-[#1c1e21]"
                  }`}
              >
                <i className='fa-solid fa-bell text-sm'></i>
                <span className='hidden sm:inline'>Notifications</span>
              </LinkRouter>
            </NavbarItem>
          </NavbarContent>
        )}

        {userToken != null && (
          <NavbarContent as='div' justify='end'>
            <Dropdown placement='bottom-end'>
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as='button'
                  className='transition-transform hover:scale-105 ring-2 ring-[#1877f2]/20'
                  color='primary'
                  name={user?.name ?? "User"}
                  size='sm'
                  src={
                    user?.photo ||
                    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
                  }
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label='Profile Actions'
                variant='flat'
                classNames={{ base: "min-w-[200px]" }}
              >
                <DropdownItem
                  key='profile-info'
                  className='h-14 gap-2 cursor-default'
                  textValue='signed in as'
                >
                  <p className='font-semibold text-xs text-[#65676b]'>
                    Signed in as
                  </p>
                  <p className='font-bold text-sm text-[#1c1e21] truncate'>
                    {user?.email}
                  </p>
                </DropdownItem>
                <DropdownItem key='Profile' textValue='Profile'>
                  <LinkRouter
                    to={"profile"}
                    className='flex items-center gap-2 text-sm font-semibold'
                  >
                    <i className='fa-solid fa-user text-[#65676b]'></i> Profile
                  </LinkRouter>
                </DropdownItem>
                <DropdownItem key='Setting' textValue='Settings'>
                  <LinkRouter
                    to={"Setting"}
                    className='flex items-center gap-2 text-sm font-semibold'
                  >
                    <i className='fa-solid fa-gear text-[#65676b]'></i> Settings
                  </LinkRouter>
                </DropdownItem>
                <DropdownItem
                  onClick={logout}
                  key='logout'
                  color='danger'
                  className='text-danger'
                >
                  <span className='flex items-center gap-2 text-sm font-semibold'>
                    <i className='fa-solid fa-right-from-bracket'></i> Log Out
                  </span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        )}

        {userToken == null && (
          <NavbarContent className='gap-2' justify='end'>
            <NavbarItem>
              <LinkRouter
                to={"/register"}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-150 ${isActive("/register")
                  ? "bg-[#145dbf] text-white shadow-inner"
                  : "text-white bg-[#1877f2] hover:bg-[#166fe5] shadow-sm shadow-[#1877f2]/30"
                  }`}
              >
                Register
              </LinkRouter>
            </NavbarItem>
            <NavbarItem>
              <LinkRouter
                to={"/login"}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-150 ${isActive("/login")
                  ? "bg-[#145dbf] text-white shadow-inner"
                  : "text-white bg-[#1877f2] hover:bg-[#166fe5] shadow-sm shadow-[#1877f2]/30"
                  }`}
              >
                Login
              </LinkRouter>
            </NavbarItem>
          </NavbarContent>
        )}
      </HerouiNavbar>
    </>
  );
}