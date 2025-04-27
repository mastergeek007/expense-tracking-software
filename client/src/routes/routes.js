import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../Components/ErrorPage/ErrorPage";
import Login from "../Components/login/Login/Login";
import Register from "../Components/login/Register/Register";
import ResetPass from "../Components/login/ResetPass/ResetPass";
import DashboardLayout from "../Layout/DashboardLayout";
import CostsCategoriesLists from "../views/cost-category/CostCategoryLists";
import CostCategoryLists from "../views/cost-category/table/CostCategoryLists";
import DeleteCostCategory from "../views/cost-category/table/TableList";
import AddCost from "../views/cost/AddCost";
import Dashboard from "../views/dashboard/Dashboard";
import FundCategoriesLists from "../views/fund-category/FundCategoryLists";
import FundCategoryLists from "../views/fund-category/table/FundCategoryLists";
import DeleteFundCategory from "../views/fund-category/table/TableList";
import AddFund from "../views/fund/AddFund";
import Reports from "../views/reports";
import ExpensesReport from "../views/reports/costs/table/TableList";
import IncomesReport from "../views/reports/funds/table/TableList";
import SupportPage from "../views/support/Support";
import PrivateRoute from "./PrivateRoute";
import ProtectedRoute from "./ProtectedRoute";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/delete-cost-category",
        element: (
          <PrivateRoute>
            <DeleteCostCategory />
          </PrivateRoute>
        ),
      },
      {
        path: "/delete-fund-category",
        element: (
          <PrivateRoute>
            <DeleteFundCategory />
          </PrivateRoute>
        ),
      },
      {
        path: "/fund-category/:category",
        element: (
          <PrivateRoute>
            <FundCategoryLists />
          </PrivateRoute>
        ),
      },
      {
        path: "/cost-category/:category",
        element: (
          <PrivateRoute>
            <CostCategoryLists />
          </PrivateRoute>
        ),
      },
      {
        path: "/add-fund",
        element: (
          <PrivateRoute>
            <AddFund />
          </PrivateRoute>
        ),
      },
      {
        path: "/edit-fund/:id",
        element: (
          <PrivateRoute>
            <AddFund />
          </PrivateRoute>
        ),
      },
      {
        path: "/add-cost",
        element: (
          <PrivateRoute>
            <AddCost />
          </PrivateRoute>
        ),
      },
      {
        path: "/edit-cost/:id",
        element: (
          <PrivateRoute>
            <AddCost />
          </PrivateRoute>
        ),
      },
      {
        path: "/fund-category",
        element: (
          <PrivateRoute>
            <FundCategoriesLists />
          </PrivateRoute>
        ),
      },
      {
        path: "/cost-category",
        element: (
          <PrivateRoute>
            <CostsCategoriesLists />
          </PrivateRoute>
        ),
      },
      {
        path: "/reports",
        element: (
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        ),
      },
      {
        path: "/reports/incomes",
        element: (
          <PrivateRoute>
            <IncomesReport />
          </PrivateRoute>
        ),
      },
      {
        path: "/reports/expenses",
        element: (
          <PrivateRoute>
            <ExpensesReport />
          </PrivateRoute>
        ),
      },
      {
        path: "/support",
        element: (
          <PrivateRoute>
            <SupportPage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute>
        <Login />
      </ProtectedRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <ProtectedRoute>
        <Register />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <ProtectedRoute>
        <ResetPass />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <ErrorPage></ErrorPage>,
  },
]);
