import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import MetaDataForm from "./MetadataForm"
function MetadataDialog({ file, onImageRemove, initialData = null, mode = "add",children,   onSaved = () => {}}) {
  return (
    <Dialog>
      <DialogTrigger className="w-full">
        {children || mode === "edit" ? "Edit Metadata" : "Add Metadata"}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {children || mode === "edit" ? "Edit Product Information" : "Product Information"}
          </DialogTitle>
          <DialogDescription>
            <MetaDataForm
              file={file}
              onImageRemove={onImageRemove}
              initialData={initialData} // pass data for edit mode
              mode={mode} // can be used inside form to change behavior
              productId={initialData?._id} // <<< pass the DB _id here
              onSaved={onSaved}          // <- forward it
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default MetadataDialog