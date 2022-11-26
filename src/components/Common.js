import styled from "styled-components";

export const Button = styled.button`
  border: 1px solid #ccc;
  padding: 8px 16px;
  :disabled {
    background: #ccc;
  }
  margin: 24px;
`;

export const StyledButton = ({ children, ...rest }) => {
  return (
    <button
      {...rest}
      className={`
        text-white
        bg-blue-700
        hover:bg-blue-800
        focus:ring-4
        focus:outline-none
        focus:ring-blue-300
        font-medium
        text-sm
        w-full
        sm:w-auto px-5
        py-2.5
        text-center
        mx-1`}
    >
      {children}
    </button>
  );
};
