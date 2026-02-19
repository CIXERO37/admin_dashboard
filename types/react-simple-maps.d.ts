declare module "react-simple-maps" {
    import { ComponentType, ReactNode, CSSProperties } from "react";

    interface ComposableMapProps {
        width?: number;
        height?: number;
        projectionConfig?: {
            scale?: number;
            center?: [number, number];
            rotate?: [number, number, number];
        };
        projection?: string;
        className?: string;
        style?: CSSProperties;
        children?: ReactNode;
    }

    interface GeographiesProps {
        geography: string | object;
        children: (data: { geographies: Geography[] }) => ReactNode;
    }

    interface Geography {
        rsmKey: string;
        id: string;
        properties: Record<string, string>;
        [key: string]: unknown;
    }

    interface GeographyProps {
        geography: Geography;
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
        style?: {
            default?: React.CSSProperties & { outline?: string };
            hover?: React.CSSProperties & { outline?: string };
            pressed?: React.CSSProperties & { outline?: string };
        };
        className?: string;
        key?: string;
    }

    interface MarkerProps {
        coordinates: [number, number];
        children?: ReactNode;
        key?: string;
    }

    interface ZoomableGroupProps {
        center?: [number, number];
        zoom?: number;
        minZoom?: number;
        maxZoom?: number;
        children?: ReactNode;
    }

    export const ComposableMap: ComponentType<ComposableMapProps>;
    export const Geographies: ComponentType<GeographiesProps>;
    export const Geography: ComponentType<GeographyProps>;
    export const Marker: ComponentType<MarkerProps>;
    export const ZoomableGroup: ComponentType<ZoomableGroupProps>;
}
