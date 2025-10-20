import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Panel from "../Screens/personalPanel";

export const router  = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <div>Error 404: Not Found</div>
    },
    {
        path: "/personal",
        element: <Panel />,
        errorElement: <div>Error 404: Not Found</div>
    }
])