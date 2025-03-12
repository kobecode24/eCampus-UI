import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, Send, UserCog, Trash2 } from "lucide-react"
import { ChangeRoleModal } from "./change-role-modal"

interface UserBulkActionsProps {
  selectedUsers: string[]
}

export function UserBulkActions({ selectedUsers }: UserBulkActionsProps) {
  const hasSelection = selectedUsers.length > 0
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false)

  return (
    <>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          disabled={!hasSelection}
          className="bg-[#2a3754] border-gray-700 text-white hover:bg-[#3a4764] hover:text-white"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button 
          variant="outline" 
          disabled={!hasSelection}
          className="bg-[#2a3754] border-gray-700 text-white hover:bg-[#3a4764] hover:text-white"
        >
          <Send className="mr-2 h-4 w-4" />
          Message
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              disabled={!hasSelection}
              className="bg-[#2a3754] border-gray-700 text-white hover:bg-[#3a4764] hover:text-white"
            >
              <UserCog className="mr-2 h-4 w-4" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="bg-[#2a3754] border border-gray-700 text-white min-w-[160px]"
            style={{ backgroundColor: '#2a3754' }}
          >
            <DropdownMenuItem 
              className="hover:bg-[#3a4764] focus:bg-[#3a4764] text-white cursor-pointer"
              onClick={() => setIsChangeRoleModalOpen(true)}
            >
              Change Role
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#3a4764] focus:bg-[#3a4764] text-white cursor-pointer">
              Suspend Selected
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-red-600/90 focus:bg-red-600/90 text-red-500 hover:text-white focus:text-white cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ChangeRoleModal
        open={isChangeRoleModalOpen}
        onClose={() => setIsChangeRoleModalOpen(false)}
        selectedUsers={selectedUsers}
      />
    </>
  )
}

