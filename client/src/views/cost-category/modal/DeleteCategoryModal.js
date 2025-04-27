import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DeleteModal from "../../../Components/modal/DeleteModal";
import { useDeleteCategoryMutation } from "../../../features/categories/categoryAPI";

const DeleteCategoryModal = ({ showDeleteModal, setShowDeleteModal, item }) => {
  const [isDelete, setIsDelete] = useState(false);

  const [deleteCategory, { isLoading, isSuccess, isError, error }] =
    useDeleteCategoryMutation();

  const handleDelete = () => {
    deleteCategory(item?._id);
    setIsDelete(false);
  };

  useEffect(() => {
    if (isDelete) {
      handleDelete();
    }
    if (isError) {
      toast.error(error.data.message);
    }
    if (!isError && isSuccess) {
      setShowDeleteModal(false);
    }
  }, [isDelete, isSuccess, isError]);
  return (
    <DeleteModal
      {...{ showDeleteModal, setShowDeleteModal, isLoading, setIsDelete }}
      message={`Are you sure you want to delete "${item?.name}" category`}
    ></DeleteModal>
  );
};

export default DeleteCategoryModal;
