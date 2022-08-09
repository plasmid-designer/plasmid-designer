import { Button, Card, Popover } from '@geist-ui/core'
import React, { useState, useRef, useCallback } from 'react'
import styled from 'styled-components'

type Props = {
    className?: string,
    title?: string,
    children: React.ReactNode,
}

type ContentProps = {
    className?: string,
    children: React.ReactNode,
}

const _MenuContent = ({ className, children }: ContentProps) => {
    return (
        <div className={className}>
            {children}
        </div>
    )
}

const MenuContent = styled(_MenuContent)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0rem 1rem;
    gap: .25rem;
`

const MenuButton = ({className, title, children}: Props) => {
    const ref = useRef(null)
    const [isOpen, setIsOpen] = useState(false)

    const handleClick = useCallback((e: React.MouseEvent) => {
        if ((e.target as HTMLElement)?.parentElement !== ref.current) return
        setIsOpen(!isOpen)
    }, [isOpen])

    return (
        <div ref={ref} className={className}>
            <Popover content={(
                <MenuContent>{children}</MenuContent>
            )}>
                <Button width={"4rem"} height={"1.5rem"}>{title}</Button>
            </Popover>
        </div>
    )
}

export default styled(MenuButton)`
    display: flex;
    align-items: center;
    padding: 0 .25rem 0 .75rem;
    font-weight: 500;
    border-left: 1px solid hsl(0,0%,90%);
    height: 100%;
    user-select: none;
`
