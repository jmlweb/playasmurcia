'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { LuArrowLeft, LuArrowRight, LuX } from 'react-icons/lu';

import { IMAGES } from '@/config/images';

const EnabledModal = ({
  picture,
  width,
  height,
  handleClose,
  prev,
  next,
}: {
  picture: string;
  width: number;
  height: number;
  handleClose: () => void;
  prev: string;
  next: string;
}) => {
  const [isCloseVisible, setIsCloseVisible] = useState(false);
  const pathname = usePathname();
  return (
    <Dialog.Root
      defaultOpen
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
          setIsCloseVisible(false);
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-30 grid place-items-center bg-gray-900/80 data-[state=closed]:animate-fadeOut data-[state=open]:animate-fadeIn backdrop-blur-2xl">
          <Dialog.Content
            className="relative grid place-items-center max-w-[96vw] shadow-2xl overflow-x-auto w-full"
            style={{
              aspectRatio: `${width}/${height}`,
            }}
          >
            {isCloseVisible ? (
              <>
                <Dialog.Close className="text-white bg-gray-700/50 rounded-full text-xl fixed top-4 right-3 animate-fadeIn p-2">
                  <LuX />
                </Dialog.Close>
                {prev !== picture && (
                  <Link
                    href={`${pathname}?picture=${prev}`}
                    className="text-white bg-gray-700/50 rounded-full text-3xl fixed top-1/2 -mt- left-3 animate-fadeIn p-2 -mt-[23px]"
                  >
                    <LuArrowLeft />
                  </Link>
                )}
                {next !== picture && (
                  <Link
                    href={`${pathname}?picture=${next}`}
                    className="text-white bg-gray-700/50 rounded-full text-3xl fixed top-1/2 right-3 animate-fadeIn p-2 -mt-[23px]"
                  >
                    <LuArrowRight />
                  </Link>
                )}
              </>
            ) : (
              <div className="animate-wiggle text-white animate-infinite whitespace-nowrap absolute">
                Cargando fotografía...
              </div>
            )}
            <Image
              src={`${IMAGES.detail}${picture}`}
              alt=""
              className="block bg-gray-100/50 transition-all"
              width={width}
              height={height}
              priority
              quality={100}
              onLoadingComplete={() => setIsCloseVisible(true)}
              style={{
                minWidth: `calc(${width}px/2)`,
              }}
            />
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const Modal = ({
  sizes,
}: {
  sizes: Record<string, { width: number; height: number }>;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const picture = params.get('picture');
  const size = picture ? sizes[picture] : null;
  const pictures = Object.keys(sizes);
  const index = pictures.indexOf(picture);
  const prev = pictures[index - 1] || pictures[pictures.length - 1];
  const next = pictures[index + 1] || pictures[0];

  const handleClose = () => {
    router.replace(pathname);
  };

  return picture ? (
    <EnabledModal
      picture={picture}
      width={size.width}
      height={size.height}
      handleClose={handleClose}
      prev={prev}
      next={next}
    />
  ) : null;
};

export default Modal;
