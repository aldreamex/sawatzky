import React, { ReactElement } from 'react';

export default function isReactElement(element: any): element is ReactElement {
  return React.isValidElement(element);
}
