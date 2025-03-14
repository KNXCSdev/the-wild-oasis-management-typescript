import { createContext, SetStateAction, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideclick";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

interface StyledListProps {
  position: { x: number; y: number } | null;
}

const StyledList = styled.ul<StyledListProps>`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.position?.x}px;
  top: ${(props) => props.position?.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

interface ContexTypes {
  openId: number;
  close: () => void;
  open: (id: number) => void;
  position: { x: number; y: number } | null;
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
}

const defaultContext: ContexTypes = {
  openId: 0,
  close: () => {},
  open: () => {},
  position: null,
  setPosition: () => {},
};

const MenusContext = createContext<ContexTypes>(defaultContext);

function Menus({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  const close = () => setOpenId(0);
  const open = setOpenId;

  return (
    <MenusContext.Provider value={{ openId, close, open, position, setPosition }}>
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ id }: { id: number }) {
  const { openId, close, open, setPosition } = useContext(MenusContext);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = (e.target as HTMLElement).closest("button")!.getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });

    openId === 0 || openId !== id ? open(id) : close();
  }

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

interface ListTypes {
  id: number;
  children: React.ReactNode;
}

function List({ id, children }: ListTypes) {
  const { openId, position, close } = useContext(MenusContext);
  const ref = useOutsideClick(close);

  if (openId !== id) return null;

  return createPortal(
    <StyledList position={position} ref={ref as unknown as React.Ref<HTMLUListElement>}>
      {children}
    </StyledList>,
    document.body
  );
}

interface ButtonTypes {
  icon: React.ReactElement;
  children: React.ReactNode;
  onClick?: () => void;
}

function Button({ children, icon, onClick }: ButtonTypes) {
  const { close } = useContext(MenusContext);

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
