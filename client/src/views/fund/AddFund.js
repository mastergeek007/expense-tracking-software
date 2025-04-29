import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import BaseSelectBox from "../../Components/common/BaseSelectBox";
import BaseInput from "../../Components/inputs/BaseInput";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { AuthContext } from "../../Context/AuthProvider";
import { useGetUserFundCategoriesQuery } from "../../features/categories/categoryAPI";
import {
  useAddFundMutation,
  useGetSingleFundQuery,
  useUpdateFundMutation,
} from "../../features/funds/fundsAPI";

const AddFund = () => {
  const { user } = useContext(AuthContext);
  const { page, limit, search } = useSelector((state) => state.filters);
  const { id } = useParams();
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();

  const {
    data: singleFund,
    isSuccess: isGetSingleFundSuccess,
  } = useGetSingleFundQuery(id, { skip: !id });

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    notes: "",
    date: "",
    time: "",
  });

  const [errors, setErrors] = useState({});

  const { data, isLoading, isError, error } =
    useGetUserFundCategoriesQuery({
      user: user?.email,
      page,
      limit,
      search,
    });

  const { data: fundCategories } = data?.results || {};

  const [
    addFund,
    {
      isLoading: isAddLoading,
      isSuccess: isAddSuccess,
      isError: isAddError,
      error: addError,
    },
  ] = useAddFundMutation();

  const [
    updateFund,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateFundMutation();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.notes) newErrors.notes = "Notes are required";
    if (!formData.amount) newErrors.amount = "Amount is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for the field being updated
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const data = {
      ...formData,
      money: Number(formData.amount),
      user: user?.email,
    };
    if (editMode) {
      updateFund({ id, data });
    } else {
      addFund(data);
    }
  };

  useEffect(() => {
    // Check if the request is successful or there is an error
    if (isAddSuccess || isUpdateSuccess) {
      if (isUpdateSuccess) {
        toast.success("Fund updated successfully!");
      } else {
        toast.success("Fund added successfully!");
      }
      navigate(`/fund-category/${formData.category}`);
      setFormData({
        category: "",
        amount: "",
        notes: "",
        date: "",
        time: "",
      });
    }
    if (isAddError || isUpdateError) {
      toast.error(addError?.data?.message || updateError?.data?.message);
    }
  }, [
    isAddError,
    isAddSuccess,
    isUpdateSuccess,
    isUpdateError,
    addError,
    updateError,
  ]);

  useEffect(() => {
    if (id && isGetSingleFundSuccess && singleFund) {
      setEditMode(true);
      setFormData({
        category: singleFund.result.category || "",
        amount: singleFund.result.money || "",
        notes: singleFund.result.notes || "",
        date: singleFund.result.date || "",
        time: singleFund.result.time || "",
      });
    }
  }, [id, isGetSingleFundSuccess, singleFund]);

  return (
    <div className="h-full flex justify-center items-center">
      {fundCategories?.length === 0 ? (
        <div className="h-[100vh] px-6 flex items-center justify-center">
          <div>
            <h1 className="md:text-2xl sm:text-xl text-lg text-center font-semibold">
              You Have not any Fund Category Please Create a Fund Category FIrst
            </h1>
            <Link to="/fund-category">
              <div className="text-center">
                <button className="px-5 py-3 bg-primary text-white rounded-sm mt-5">
                  Create Fund Category
                </button>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        <div className="modal-box w-full rounded-sm mx-auto">
          <form onSubmit={handleSubmit}>
            <h3 className="text-center text-3xl font-semibold mb-10">
              {editMode ? "Edit Fund" : "Add Fund"}
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 my-4">
              <div>
                <label
                  className="block text-gray-700 dark:text-white font-bold mb-2"
                  htmlFor="category"
                >
                  Select Category
                </label>

                <BaseSelectBox
                  lists={fundCategories}
                  isLoading={isLoading}
                  isError={isError}
                  error={error}
                  value={formData.category}
                  setValue={(value) => handleChange("category", value)}
                  disabled={editMode}
                />
              </div>
              <div>
                <BaseInput
                  label="Amount"
                  type="number"
                  required
                  value={formData.amount}
                  setValue={(value) => handleChange("amount", value)}
                  showError={!!errors.amount}
                  errorMessage={errors.amount}
                  placeholder="Enter the amount"
                />
              </div>

              <div>
                <BaseInput
                  label="Date"
                  type="date"
                  required
                  value={formData.date}
                  setValue={(value) => handleChange("date", value)}
                  showError={!!errors.date}
                  errorMessage={errors.date}
                  placeholder="Enter the date"
                />
              </div>
              <div>
                <BaseInput
                  label="Time"
                  type="time"
                  required
                  value={formData.time}
                  setValue={(value) => handleChange("time", value)}
                  showError={!!errors.time}
                  errorMessage={errors.time}
                  placeholder="Enter the time"
                />
              </div>
            </div>

            <div className="mb-4">
              <BaseInput
                label="Notes"
                required
                placeholder="Enter your notes"
                value={formData.notes}
                setValue={(value) => handleChange("notes", value)}
                errorMessage={errors.notes}
                showError={!!errors.notes}
              />
            </div>

            {isAddError && (
              <p className="text-sm text-red-600 mt-2">{addError.message}</p>
            )}

            <div className="modal-action">
              <button
                type="submit"
                htmlFor="fund-modal"
                className="flex items-center gap-3 px-5 py-3 bg-primary disabled:bg-primary/50 disabled:cursor-not-allowed text-white rounded-sm"
                disabled={isAddLoading || isUpdateLoading}
              >
                {isAddLoading || isUpdateLoading ? <LoadingSpinner /> : ""}
                {editMode ? "Update Fund" : "Add Fund"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddFund;
