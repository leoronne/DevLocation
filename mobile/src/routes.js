import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Main from "./pages/Main";
import Profile from "./pages/Profile";

const Routes = createAppContainer(
  createStackNavigator(
    {
      Main: {
        screen: Main,
        path: "main",
        navigationOptions: {
          title: "Dev Location"
        }
      },
      Profile: {
        screen: Profile,
        path: "profile",
        navigationOptions: {
          title: "GitHub Profile"
        }
      }
    },
    {
      defaultNavigationOptions: {
        headerTintColor: "#fff",
        headerStyle: {
          backgroundColor: "#8b54a8"
        }
      }
    }
  )
);

export default Routes;
