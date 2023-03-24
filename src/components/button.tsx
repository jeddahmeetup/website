interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

export const Button = (props: ButtonProps) => {
  return (
    <button
      {...props}
      className="block font-semibold text-sm text-center py-3 px-4 text-white bg-[#72389c] hover:bg-[#8d55b5] duration-150 rounded-lg shadow md:px-2 md:py-2 lg:px-4 disabled:bg-[#e2caf3]"
    ></button>
  );
};
