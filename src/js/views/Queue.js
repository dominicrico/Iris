
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import FontAwesome from 'react-fontawesome'
import TrackList from '../components/TrackList'
import Track from '../components/Track'
import SidebarToggleButton from '../components/SidebarToggleButton'
import FullPlayer from '../components/FullPlayer'
import ArtistSentence from '../components/ArtistSentence'
import Header from '../components/Header'

import * as uiActions from '../services/ui/actions'
import * as spotifyActions from '../services/spotify/actions'
import * as mopidyActions from '../services/mopidy/actions'

class Queue extends React.Component{

	constructor(props) {
		super(props);
	}

	removeTracks( tracks_indexes ){
		var tlids = [];
		for( var i = 0; i < tracks_indexes.length; i++ ){
			tlids.push( this.props.current_tracklist[tracks_indexes[i]].tlid )
		}
		this.props.mopidyActions.removeTracks( tlids )
	}

	playTrack( track ){
		this.props.mopidyActions.changeTrack( track.tlid )
	}

	playTracks( tracks ){
		this.props.mopidyActions.changeTrack( tracks[0].tlid )
	}

	reorderTracks( indexes, index ){
		this.props.mopidyActions.reorderTracklist( indexes, index )
	}

	renderRadio(){
		if (!this.props.radio) return null

		return (
			<div className="radio">
				Playing radio
				<button onClick={ e => this.props.pusherActions.instruct('stop_radio') }>Stop radio</button>
			</div>
		)
	}

	render(){
		return (
			<div className="view queue-view">
			
				<Header icon="play" title="Now playing" />

				<FullPlayer />

				{ this.renderRadio() }

				<section className="list-wrapper">
					<TrackList
						show_source_icon={true}
						context="queue"
						tracks={this.props.current_tracklist} 
						removeTracks={ tracks => this.removeTracks( tracks ) }
						playTracks={ tracks => this.playTracks( tracks ) }
						playTrack={ track => this.playTrack( track ) }
						reorderTracks={ (indexes, index) => this.reorderTracks(indexes, index) } />
				</section>
				
			</div>
		);
	}
}


/**
 * Export our component
 *
 * We also integrate our global store, using connect()
 **/

const mapStateToProps = (state, ownProps) => {
	return {
		radio: state.ui.radio,
		current_tracklist: state.ui.current_tracklist
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		uiActions: bindActionCreators(uiActions, dispatch),
		spotifyActions: bindActionCreators(spotifyActions, dispatch),
		mopidyActions: bindActionCreators(mopidyActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Queue)