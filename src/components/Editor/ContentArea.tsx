import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from "@tiptap/starter-kit"
import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import EditTools from './EditTools'
import Italic from '@tiptap/extension-italic'
import Link from "@tiptap/extension-link"
import Code from "@tiptap/extension-code"
import Highlight from "@tiptap/extension-highlight"
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import Underline from "@tiptap/extension-underline"
import Heading from '@tiptap/extension-heading'

type Props = {
    content: string
    setContent: (newContent: string) => void
}

const ContentArea = ({content, setContent}: Props) => {
    const editor = useEditor ({
        extensions:[
            StarterKit,
            Document, 
            Paragraph, 
            Text, 
            Bold,
            Heading.configure({
                levels:[1,2,3]
            }),
            Underline,
            Code,
            Italic,
            Highlight.configure({multicolor:false}),
            Link.configure({
                openOnClick:true
            }),
            BulletList,
            ListItem
        ],
        content:'<p>Write your Post ...</p>',
        autofocus:true,
        editorProps:{
            attributes:{
                class: "prose prose-sm sm:prose focus:outline-none prose-p:loading-0 prose-a:text-red-400 xl:prose-base dark:prose-code:text-white dark:prose-p:text-white dark:prose-h1:text-white dark:prose-h2:text-white dark:prose-h3:text-white dark:prose-strong:text-white dark:prose-italic:text-white "
            }
        }
    })

    if(!editor){
        return null
    }

    const html = editor.getHTML()

    setContent(html)
  return (
    <div>
        <EditTools editor={editor} />
        <div className='py-4'>
        <EditorContent className='p-4 border-red-400 border-[1px] rounded-md border-dotted' editor={editor} />
        </div>
    </div>
  )
}

export default ContentArea