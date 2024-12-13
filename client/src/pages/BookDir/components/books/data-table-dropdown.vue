<script setup lang="ts">
import { useBookGeneralStore } from '@/stores/BookGeneralStore';

import { useRouter } from 'vue-router';
import { toast } from "vue-sonner"
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-vue-next';
import { Dialog, DialogContent, DialogTrigger, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

defineProps<{
    book: {
        id: string;
    };
}>();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const bookGenStore = useBookGeneralStore()
const router = useRouter();

function copy(id: string) {
    navigator.clipboard.writeText(id);
}

const goToBook = (id: string) => {
    router.push(`/books/${id}`);
};

const handleDeleteBook = async (id: string) => {
    try {
        const result = await bookGenStore.deleteBook(id);
        if (result?.success) {
            toast.info("cool")
            await delay(2500)
            router.go(0)
        } else {
            toast.warning("cool")
        }
    } catch (error: unknown) {
        toast.error("cool")
        console.log((error as Error).message)
    }
};
</script>

<template>
    <Dialog>
        <DropdownMenu>
            <DropdownMenuTrigger as-child>
                <Button variant="ghost" class="w-8 h-8 p-0">
                    <span class="sr-only">Open menu</span>
                    <MoreHorizontal class="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem @click="goToBook(book.id)" class="cursor-pointer">Start reading</DropdownMenuItem>
                <DropdownMenuItem @click="copy(book.id)">
                    Copy Book Id
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DialogTrigger class="w-full">
                    <DropdownMenuItem
                        class="bg-red-200 cursor-pointer bg-opacity-40 border-red-300 border hover:bg-red-500 text-black">
                        Delete
                    </DropdownMenuItem>
                </DialogTrigger>
            </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent class="sm:max-w-md" @interact-outside="event => {
            const target = event.target as HTMLElement;
            if (target?.closest('[data-sonner-toaster]')) return event.preventDefault()
        }">
            <DialogHeader>
                <DialogTitle>Delete book</DialogTitle>
                <DialogDescription>This action can not be undo </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4">
                <Button size="sm" class="px-3" @click="handleDeleteBook(book.id)">
                    Confirm delete
                </Button>
            </div>
        </DialogContent>
    </Dialog>
</template>