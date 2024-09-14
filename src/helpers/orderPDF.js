import { useReactToPrint } from "react-to-print";

const HandlePrint = (componentRef) => {
  const print = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Order",
    onAfterPrint: () => console.log(" print successfuly..."),
    removeAfterPrint: true,
  });
  return print;
};

export default HandlePrint;
