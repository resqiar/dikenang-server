import styled from 'styled-components'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Icons from '../icons/Icons'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import PublicIcon from '@material-ui/icons/Public'
import LockIcon from '@material-ui/icons/Lock'

interface Props {
	postTypeValue: string
	onChangeCallbacks: (
		event: React.ChangeEvent<{
			value: unknown
		}>
	) => void
}

const useStyles = makeStyles(() =>
	createStyles({
		selectStyle: {
			fontFamily: 'var(--font-family)',
			fontSize: '14px',
			color: 'var(--font-white-600)',
		},
	})
)

export default function FeedTypeAttribute(props: Props) {
	const classes = useStyles()

	return (
		<FeedInputProfileAttribute>
			<Icons
				Icon={props.postTypeValue === 'public' ? PublicIcon : LockIcon}
				size={18}
				padding="0px"
				color="var(--font-white-600)"
				hasIconButton={false}
			/>

			<FeedInputProfileAttributeType>
				{/* Post Type Button */}
				<FormControl size="small">
					<Select
						labelId="select-post-type"
						id="select-post-is-public-or-private"
						defaultValue="public"
						className={classes.selectStyle}
						value={props.postTypeValue}
						onChange={props.onChangeCallbacks}
					>
						<MenuItem value="public">Publicly Available</MenuItem>
						<MenuItem value="private">
							Share with partner only
						</MenuItem>
					</Select>
				</FormControl>
			</FeedInputProfileAttributeType>
		</FeedInputProfileAttribute>
	)
}

const FeedInputProfileAttribute = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
`

const FeedInputProfileAttributeType = styled.div`
	margin-top: -4px;
	margin-left: 2px;
`
