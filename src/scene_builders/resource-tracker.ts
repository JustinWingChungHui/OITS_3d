interface Disposable {
    dispose(): void;
}

export default class ResourceTracker {
    static resources: Set<Disposable>;

    static init() {
        ResourceTracker.resources = new Set<Disposable>();
    }

    static track<T extends object>(resource: T): T {
        // eslint-disable-next-line
        if ('dispose' in resource as any) {
            ResourceTracker.resources.add(resource as unknown  as Disposable);
        }
        return resource;
    }

    static untrack<T extends object>(resource: T): T {
        // eslint-disable-next-line
        if ('dispose' in resource as any) {
            ResourceTracker.resources.delete(resource as unknown as Disposable);
        }
        return resource;
    }


    static dispose() {
        for (const resource of ResourceTracker.resources) {
            window.console.log(`Disposing:`);
            window.console.log(resource);
            resource.dispose();
        }
        ResourceTracker.resources.clear();
    }
}