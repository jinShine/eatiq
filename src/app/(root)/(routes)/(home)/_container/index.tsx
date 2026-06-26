"use client";

import { useRef, useState } from "react";

import Link from "next/link";

import { BellIcon } from "lucide-react";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  DropdownMenu,
  DropdownMenuItem,
  HStack,
  Input,
  Modal,
  ModalActions,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MultiSelect,
  NotiBadge,
  NumberInput,
  Paginator,
  PaginatorV2,
  PasswordInput,
  Popover,
  Select,
  SelectItem,
  Sheet,
  SpinLoader,
  TagInput,
  Text,
  Textarea,
  Toast,
  VStack,
} from "@components/ui";
import { SelectGroup, SelectLabel } from "@components/ui/select/Select";

import { useBoundingRect, useDisclosure } from "@hooks/commons";

import SpringBox from "../_components/SpringBox";

export default function AppContainer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isOpenSheet, setIsOpenSheet] = useState(false);

  const elementRef = useRef<HTMLDivElement>(null);
  const { rect, originRect } = useBoundingRect(elementRef);

  return (
    <div>
      <BaseContainerLayout
        content={
          <BaseContentLayout>
            <SpringBox />
            <SpinLoader />
            <div ref={elementRef}>
              rect:{rect?.top} originRect:{originRect?.top}
            </div>
            <DropdownMenu
              trigger={
                <Button variant="outline" className="w-fit">
                  123
                </Button>
              }
            >
              <DropdownMenuItem onClick={() => setIsOpen3(true)}>DropdownMenuItem</DropdownMenuItem>
            </DropdownMenu>

            <Modal isOpen={isOpen3} onOpenChange={setIsOpen3}>
              <ModalHeader className="bg-amber-100">Modal Title</ModalHeader>
              <ModalBody className="bg-blue-100">asdf</ModalBody>
              <ModalFooter className="bg-green-100">Footer</ModalFooter>
            </Modal>
            <Sheet side="bottom" isOpen={isOpenSheet} onOpenChange={setIsOpenSheet}>
              Sheet Content
            </Sheet>
            <div className="flex items-center gap-4">
              <NotiBadge count={1}>
                <BellIcon />
              </NotiBadge>
              <NotiBadge count={12}>
                <BellIcon />
              </NotiBadge>
              <NotiBadge count={123}>
                <BellIcon />
              </NotiBadge>
              <NotiBadge count={1000}>
                <BellIcon />
              </NotiBadge>
              <NotiBadge isDot>
                <BellIcon />
              </NotiBadge>
              <NotiBadge isDot>
                <Button size={"icon"}>
                  <BellIcon />
                </Button>
              </NotiBadge>
              <NotiBadge count={1}>
                <Button variant="secondary" className="bg-secondary-background text-secondary">
                  Button
                </Button>
              </NotiBadge>
              <NotiBadge isDot>
                <Button variant="secondary" className="bg-secondary-background text-secondary">
                  Button
                </Button>
              </NotiBadge>
            </div>
            <VStack>
              <Badge>
                <Link href="/">Badge</Link>
              </Badge>
              <Paginator total={100} onPageChange={() => {}} />
              <PaginatorV2 onPageChange={() => {}} />
            </VStack>

            <MultiSelect
              variant={"default"}
              size="xl"
              options={[
                { label: "점주", value: "OWNER" },
                { label: "직원", value: "STAFF" },
                { label: "관리자", value: "ADMIN" },
                { label: "사용자", value: "USER" },
                { label: "게스트", value: "GUEST" },
              ]}
              onValueChange={() => {}}
            />
            <HStack>
              <Button
                onClick={() =>
                  Toast.default(
                    "Hello World!! Hello World!! Hello World!! Hello World!! Hello World!! Hello World!! Hello World!! Hello World!! Hello World!! Hello World!! ",
                  )
                }
              >
                Show Toast
              </Button>
              <Button onClick={() => Toast.success("Success", { description: "다음에 봬요." })}>Success Toast</Button>
              <Button onClick={() => Toast.info("Info")}>Info Toast</Button>
              <Button onClick={() => Toast.warning("Warning")}>Warning Toast</Button>
              <Button onClick={() => Toast.error("Hello World")}>Error Toast</Button>
            </HStack>
            <HStack>
              <Badge variant="secondary" className="bg-secondary-background text-secondary">
                Secondary
              </Badge>
              <Badge variant="default" className="bg-primary-background text-primary">
                Default
              </Badge>
              <Badge variant="default" className="bg-success-background text-success">
                Success
              </Badge>
              <Badge variant="default" className="bg-warning-background text-warning">
                Secondary
              </Badge>
              <Badge variant="default" className="bg-info-background text-info">
                Secondary
              </Badge>
            </HStack>
            <VStack>
              <Textarea defaultValue="123123" placeholder="Textarea placeholder" />
            </VStack>
            <VStack className="gap-2">
              <TagInput label="Tag Input" onChangeTags={() => {}} />
              <NumberInput label="Number Input" />
              <PasswordInput label="Password Input" />
              <Input size="sm" label="Small Input" error errorText="Error Text" />
              <Input size="md" label="Medium Input" helperText="Helper Text" />
              <Input size="lg" label="Large Input" defaultValue={"Large Input"} placeholder="Large Input" disabled />
              <Select label="직책" placeholder="직책을 선택해주세요." size="lg">
                <SelectGroup>
                  <SelectLabel>직책</SelectLabel>
                  <SelectItem value="OWNER">점주</SelectItem>
                  <SelectItem value="STAFF">직원</SelectItem>
                </SelectGroup>
              </Select>
              <Input size="xl" label="X Large Input" defaultValue={"X large input"} helperText="Helper Text" disabled />
              <Select label="직책" placeholder="직책을 선택해주세요." size="sm">
                <SelectItem value="OWNER">점주</SelectItem>
                <SelectItem value="STAFF">직원</SelectItem>
              </Select>
            </VStack>
            <VStack>
              <Text>Modal Status: {isOpen ? "Open" : "Closed"}</Text>
              <Modal
                isOpen={isOpen}
                onOpenChange={onOpen}
                trigger={
                  <Button variant="outline" className="w-fit">
                    Modal Test
                  </Button>
                }
              >
                <ModalHeader>Modal Title</ModalHeader>
                <ModalBody>Modal Body</ModalBody>
                <ModalFooter>
                  <ModalActions onCancel={onClose} />
                </ModalFooter>
              </Modal>
            </VStack>
            <VStack>
              <Text>Popover Status: {isOpen2 ? "Open" : "Closed"}</Text>
              <Popover
                isOpen={isOpen2}
                onOpenChange={setIsOpen2}
                trigger={
                  <Button variant="outline" className="w-fit">
                    Popover Test
                  </Button>
                }
              >
                <Card>
                  <CardHeader>Header</CardHeader>
                  <CardBody>
                    <Input />
                  </CardBody>
                  <CardFooter>Footer</CardFooter>
                </Card>
              </Popover>
            </VStack>
            <VStack>
              <Checkbox id="checkbox-1" label="Checkbox 1" />
            </VStack>

            <Card className="">
              <CardHeader>Header</CardHeader>
              <CardBody>Body</CardBody>
              <CardFooter>Footer</CardFooter>
            </Card>

            <HStack className="gap-2">
              <Button isLoading>default</Button>
              <Button variant="outline" isLoading>
                outline
              </Button>
              <Button variant="secondary" isLoading>
                secondary
              </Button>
              <Button variant="ghost" isLoading>
                ghost
              </Button>
              <Button variant="link" isLoading>
                link
              </Button>
              <Button variant="destructive" isLoading>
                destructive
              </Button>
            </HStack>

            <VStack>3333333333333333</VStack>

            <VStack>
              <Input placeholder="Input placeholder" />
            </VStack>

            <DropdownMenu
              trigger={
                <Button variant="outline" className="w-fit">
                  DropdownMenu Test
                </Button>
              }
            >
              <DropdownMenuItem className="focus:bg-success bg-success-background" onClick={onOpen}>
                DropdownMenuItem
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-warning bg-warning-background">DropdownMenuItem2</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">DropdownMenuItem3</DropdownMenuItem>
            </DropdownMenu>
          </BaseContentLayout>
        }
      />
    </div>
  );
}
