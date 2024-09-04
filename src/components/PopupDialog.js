import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function PopupDialog({
  buttonName = "",
  dialogTitle = "",
  dialogDescription = "",
  open,
  setOpen,
  children,
  disabledMainButton = false,
  customOpenButton,
  className,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {customOpenButton
          ? customOpenButton
          : buttonName && (
              <Button disabled={disabledMainButton}>{buttonName}</Button>
            )}
      </DialogTrigger>
      <DialogContent
        className={cn(
          "sm:max-w-[425px] max-h-[90vh] overflow-y-auto overflow-x-hidden",
          className,
        )}
      >
        <DialogHeader>
          {dialogTitle && <DialogTitle>{dialogTitle}</DialogTitle>}
          {dialogDescription && (
            <DialogDescription>{dialogDescription}</DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
