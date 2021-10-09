import Router from 'next/router'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Icons from '../icons/Icons'
import { useSpring, animated } from 'react-spring'
import { useDebounce } from 'use-debounce'
import { SearchOptions } from '../../types/searchOptions'
import { useGetSearchContentLazyQuery } from '../../generated/graphql'
import AutoCompleteSkeleton from './AutoCompleteSkeleton'

import { SearchOutlined } from '@material-ui/icons'
import useAutocomplete from '@material-ui/lab/useAutocomplete'
import { Avatar } from '@material-ui/core'

export default function AutoCompleteSearch() {
	/**
	 * UseState to determine if input is focused or not.
	 * This is useful to create a great visual representation
	 * of what is going on to the user.
	 */
	const [isMyInputFocused, setIsMyInputFocused] = useState<boolean>(false)
	/**
	 * Store input from user here and use debounce hook
	 * to delay about 1 second when user stop typing
	 * (useful to reduce API calls and make search efficient).
	 */
	const [inputValue, setInputValue] = useState<string | undefined>()
	const [debouncedValue] = useDebounce<string | undefined>(inputValue, 1000)
	const [getSearchContent, getSearchContentResult] =
		useGetSearchContentLazyQuery({
			nextFetchPolicy: 'no-cache',
		})

	useEffect(() => {
		/**
		 * Lazy query to get search content
		 * from back-end using apollo graphql
		 */
		if (!debouncedValue || debouncedValue.length === 0) return
		getSearchContent({
			variables: {
				input: debouncedValue,
			},
		})
	}, [debouncedValue])

	const {
		getRootProps,
		getInputProps,
		getListboxProps,
		getOptionProps,
		groupedOptions,
	} = useAutocomplete({
		id: 'searchHeaderAutoComplete',
		options: getSearchContentResult.data
			? (getSearchContentResult.data.searchContent as SearchOptions[])
			: ([] as SearchOptions[]),
		autoHighlight: true,
		onOpen: () => setIsMyInputFocused(true),
		onClose: () => setIsMyInputFocused(false),
		getOptionLabel: (option) => option.title,
		clearOnBlur: false,
		onInputChange: (_e, value) => setInputValue(value),
	})

	// react-spring fade animation
	const fadeAnimation = useSpring({
		from: { opacity: 0 },
		to: { opacity: 1 },
		leave: { opacity: 0 },
		reset: true,
	})

	return (
		<HeaderSearchInput>
			<InputFieldWrapper {...getRootProps()}>
				<InputFieldIcon>
					<Icons
						Icon={SearchOutlined}
						hasIconButton={false}
						color={
							isMyInputFocused
								? 'var(--font-white-700)'
								: undefined
						}
					/>
				</InputFieldIcon>
				<SearchInputElement
					placeholder="Search for memories, partners, and stuff"
					type="text"
					{...getInputProps()}
				/>
			</InputFieldWrapper>

			{getSearchContentResult.loading ? (
				<AutoCompleteSkeleton style={fadeAnimation} />
			) : (
				[
					groupedOptions.length > 0 ? (
						<AutoCompleteItemWrapper style={fadeAnimation}>
							<AutoCompleteListItemWrapper {...getListboxProps()}>
								{groupedOptions.filter(
									(value) => value.type === 'members'
								).length > 0 ? (
									<ListTitle>Members</ListTitle>
								) : undefined}
								{groupedOptions
									.filter((value) => value.type === 'members')
									.map((option, index) => (
										<AutoCompleteList
											{...getOptionProps({
												option,
												index,
											})}
											onClick={() =>
												Router.push(`/${option.title}`)
											}
											key={option.id}
										>
											<MembersWrapper>
												<AvatarElement
													src={option.avatarUrl}
													alt={`${option.title}'s avatar'`}
												/>
												<TextElement>
													{option.title}
												</TextElement>
											</MembersWrapper>
										</AutoCompleteList>
									))}

								{groupedOptions.filter(
									(value) => value.type === 'stories'
								).length > 0 ? (
									<ListTitle>Stories</ListTitle>
								) : undefined}
								{groupedOptions
									.filter((value) => value.type === 'stories')
									.map((option, index) => (
										<AutoCompleteList
											{...getOptionProps({
												option,
												index,
											})}
											onClick={() =>
												Router.push(
													`/story/${option.author}/${option.id}`
												)
											}
											key={option.id}
										>
											<TextElement>
												{option.title}
											</TextElement>
										</AutoCompleteList>
									))}
							</AutoCompleteListItemWrapper>
						</AutoCompleteItemWrapper>
					) : undefined,
				]
			)}
		</HeaderSearchInput>
	)
}

const HeaderSearchInput = styled.div`
	width: 100%;
	padding: 0px 18px;
	position: relative;

	// how mobile should behave
	@media (max-width: 600px) {
		display: none;
	}
`
const InputFieldWrapper = styled.div`
	display: flex;
	align-items: center;
	margin: 0px 8px;
	background: var(--background-dimmed-300);
	border-radius: 8px;
	box-shadow: var(--box-shadow);
`

const InputFieldIcon = styled.div`
	padding: 3px 4px 2px 8px;
	margin-bottom: -2px;
`

const SearchInputElement = styled.input`
	font-family: var(--font-family);
	width: 100%;
	font-size: 14px;
	font-weight: 300;
	color: var(--font-white-800);
	background: transparent;
	border: none;
	padding: 9px;
	outline: none;
`
const AutoCompleteItemWrapper = styled(animated.div)`
	position: absolute;
	top: 10;
	right: 0;
	left: 0;
	z-index: 999999;
	margin: 0px 5%;
	padding: 12px 18px;
	border: var(--border);
	border-bottom-left-radius: 8px;
	border-bottom-right-radius: 8px;
	box-shadow: var(--box-shadow);
	background: var(--background-dimmed-500);
`

const AutoCompleteListItemWrapper = styled.div``
const AutoCompleteList = styled.button`
	padding: 10px 8px 8px 8px;
	cursor: pointer;
	outline: none;
	background: none;
	border: none;

	&:hover {
		background: var(--background-dimmed-300);
	}
`

const ListTitle = styled.p`
	font-weight: bold;
	color: var(--font-white-600);
`

const MembersWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`

const AvatarElement = styled(Avatar)`
	height: 30px;
	width: 30px;
	margin-top: -4px;
`

const TextElement = styled.p`
	font-family: var(--font-family);
	font-size: 14px;
	color: var(--font-white-600);
`