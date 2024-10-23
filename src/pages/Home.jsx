import SideNav from "../components/SideNav";
import Content from "../components/Content";
import Control from "../components/Control";

const Home = () => {
  return (
    <div className="flex h-screen">
      <SideNav />
      <div className="flex flex-col flex-1">
        <Content />
        <Control />
      </div>
    </div>
  );
};

export default Home;
