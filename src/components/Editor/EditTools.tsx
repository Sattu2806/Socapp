import React, { useCallback } from 'react'
import {Editor} from "@tiptap/react"
import { Button } from '../ui/button'
import {Link as IconsLink, LinkIcon, List} from "lucide-react"

type Props = {
    editor: Editor
}

const EditTools = ({editor}: Props) => {

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink()
        .run()

      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url })
      .run()
  }, [editor])
  return (
    <div className='flex items-center space-x-2'>
        <Button
        size='icon'
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        B
      </Button>
      <Button
        size='icon'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active italic' : 'italic'}
      >
        I
      </Button>
      <Button
        size='icon'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'is-active' : ''}
      >
        U
      </Button>
      <Button
        size='icon'
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        H1
      </Button>
      <Button
        size='icon'
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        H2
      </Button>
      <Button
        size='icon'
        onClick={() => editor.chain().focus().toggleHeading({ level: 3}).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        H3
      </Button>
      <Button
        size='icon'
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        &lt;C&gt;
      </Button>
      <Button
        size='icon'
        variant='outline'
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={editor.isActive('highlight') ? 'is-active' : ''}
      >
        H
      </Button>
      <Button
        size='icon'
        onClick={setLink} className={editor.isActive('link') ? 'is-active' : ''}>
        <LinkIcon/>
      </Button>
      <Button
        size='icon'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <List />
      </Button>
    </div>
  )
}

export default EditTools