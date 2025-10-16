import Swal from "sweetalert2";

const SwalWithCustomStyle = Swal.mixin({
  customClass: {
    popup: "rounded-2xl shadow-2xl border border-gray-200",
    title: "text-2xl font-bold text-gray-800",
    htmlContainer: "text-gray-600",
    confirmButton: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 mx-2",
    cancelButton: "bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border-2 border-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 mx-2",
    actions: "gap-3 mt-6",
    icon: "border-4 border-red-100",
  },
  buttonsStyling: false,
  background: "#ffffff",
  backdrop: "rgba(0, 0, 0, 0.4)",
});

export const showDeleteConfirm = (
  onConfirm,
  title = "Are you sure?",
  text = "You won't be able to revert this action!"
) => {
  SwalWithCustomStyle.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusCancel: true,
    iconColor: "#ef4444",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      
      // Optional: Show success message after deletion
      SwalWithCustomStyle.fire({
        title: "Deleted!",
        text: "Your item has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000,
        customClass: {
          confirmButton: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200",
        },
      });
    }
  });
};