import React, { useEffect, useMemo } from 'react';
import { ICollectionItem } from '../../../common/interface';
import { Column, useSortBy, useTable } from 'react-table';
import moment from 'moment';
import jsZip from 'jszip';
import Common from '../../common';
import { Setting } from '../../../common/storage';

interface Prop {
  data: Array<ICollectionItem>;
  onDeleteItem: (_itemId: string) => Promise<void>;
  collectionName: string;
  imageColumns: number;
}

function CollectionViewerImage({
  data,
  onDeleteItem,
  collectionName,
  imageColumns,
}: Prop) {
  const [columns, setColumns] = React.useState(3);

  const [isDownloading, setIsDownloading] = React.useState(false);

  const [downloadingItem, setDownloadingItem] = React.useState(0);

  const handleColumnsSelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let value = event.target.value;
    setColumns(parseInt(value));

    Setting.updateViewingImageGrid(parseInt(value));
  };

  useEffect(() => {
    setColumns(imageColumns);
  }, [imageColumns]);

  const downloadAllImages = async () => {
    if (isDownloading) {
      return;
    }

    setIsDownloading(true);

    let zip = new jsZip();

    for (const item of data) {
      let pathFileName = new URL(item.content).pathname
        .split('/')
        .pop()
        ?.split('.');

      let createTime = `${moment(item.createTime).format(
        'YYYY-MM-DD-HH-mm-ss'
      )}`;

      let name = `${createTime}`;

      if (pathFileName != null && pathFileName.length > 1) {
        name = `${pathFileName[0]}-${createTime}`;
      }

      let res = await fetch(item.content);
      let blob = await res.blob();
      let extension = Common.getExtensionByContentType(blob.type);
      zip.file(`${name}${extension}`, blob, { base64: true });

      setDownloadingItem((prev) => prev + 1);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const fileName = `${collectionName}-${moment().format(
      'YYYY-MM-DD-HH-mm-ss'
    )}`;

    const href = await URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + '.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsDownloading(false);
    setDownloadingItem(0);
  };

  return (
    <div>
      <div className="flex">
        <div className="inline text-base mr-auto my-auto">
          <label className="px-4" htmlFor="columns">
            Columns
          </label>

          <select
            className="h-10 px-4 pr-10 border-solid border-2 border-grey-600 rounded-lg dark:bg-gray-800"
            id="columns"
            value={columns}
            onChange={handleColumnsSelection}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>

        <div className="inline text-base ml-auto my-auto">
          {data.length > 0 ? (
            <button
              className="my-2 p-2 px-3 text-base text-white bg-blue-500 hover:bg-blue-700 rounded-md items-center"
              onClick={downloadAllImages}
            >
              {isDownloading
                ? `${downloadingItem} / ${data.length} Items`
                : 'Download All'}
            </button>
          ) : (
            ''
          )}
        </div>
      </div>

      <div className={`py-3 grid gap-2 grid-cols-${columns}`}>
        {data.map((item) => (
          <div
            key={item.id}
            className="flex flex-col p-2 bg-gray-200 dark:bg-gray-700 rounded-md box-content"
          >
            <div className="flex py-2 justify-start text-base font-bold">
              {moment(item.createTime).format('YYYY-MM-DD hh:mm A')}
              <span className="ml-auto">
                <a
                  className="inline-block align-middle"
                  href={item.source}
                  target="_blank"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>

                <button
                  className="inline-block align-middle"
                  onClick={() => {
                    const confirmBox = window.confirm(
                      'Do you really want to delete this item?'
                    );
                    if (confirmBox === true) {
                      onDeleteItem(item.id);
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </span>
            </div>
            <div className="h-full flex items-center">
              <img className="self-center" src={item.content} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CollectionViewerImage;
