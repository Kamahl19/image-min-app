import React from 'react';
import Button from 'react-uikit-button';
import { truncString } from '../../electron/helpers';

export default React.createClass({
    displayName: 'ImagesTableRow',

    propTypes: {
        image: React.PropTypes.object.isRequired,
        openCompareImages: React.PropTypes.func.isRequired,
    },

    render() {
        const spinner = (<img src="./imgs/spin.svg" />);

        const image = this.props.image;

        const name = truncString(image.name, 50);
        const origSize = image.origSize + 'kB';
        const newSize = (image.newSize !== null) ? image.newSize + 'kB' : spinner;

        const savedSpace = (image.newSize !== null) ? image.origSize - image.newSize + 'kB (' + image.compressionRate * 100 + '%)' : spinner;

        const button = (image.newPath !== null) ? (
            <Button body="Open" context="primary" size="mini" onClick={this.props.openCompareImages.bind(null, [image.origPath, image.newPath])} />
        ) : spinner;

        return (
            <tr>
                <td className="uk-text-left">{ name }</td>
                <td className="uk-text-left">{ origSize }</td>
                <td className="uk-text-left">{ newSize }</td>
                <td className="uk-text-left uk-text-success">{ savedSpace }</td>
                <td className="uk-text-left">{ button }</td>
            </tr>
        );
    }
});
