import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import {
  FaAngleDown,
  FaAngleLeft,
  FaAngleRight,
  FaAngleUp,
  FaBars,
  FaCirclePlus,
  FaCircleXmark,
  FaEye,
  FaEyeSlash,
  FaGear,
  FaMagnifyingGlass,
  FaPlus,
  FaRegCircleXmark,
  FaRotateRight,
  FaXmark,
} from "react-icons/fa6";
import { FiPlusCircle } from "react-icons/fi";

const IconTypes = {
  arrowLeft: FaAngleLeft,
  arrowRight: FaAngleRight,
  arrowUp: FaAngleUp,
  arrowDown: FaAngleDown,
  close: FaXmark,
  closeFill: FaCircleXmark,
  closeOutline: FaRegCircleXmark,
  plus: FaPlus,
  plusFill: FaCirclePlus,
  plusOutline: FiPlusCircle,
  search: FaMagnifyingGlass,
  hamburger: FaBars,
  visible: FaEye,
  unvisible: FaEyeSlash,
  refresh: FaRotateRight,
  system: FaGear,
  moreVertical: BsThreeDotsVertical,
  moreHorizontal: BsThreeDots,
};

type IconProps = React.SVGAttributes<SVGElement> & {
  name: keyof typeof IconTypes;
};

export default function BaseIcon({ name, ...props }: IconProps) {
  const Icon = IconTypes[name];

  return <Icon {...props} />;
}
