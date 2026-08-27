export function formatDate(iso: string) {
    const date = new Date(iso);
    const day = date.getDate();
    const suffix =
        day % 10 === 1 && day !== 11
            ? 'st'
            : day % 10 === 2 && day !== 12
                ? 'nd'
                : day % 10 === 3 && day !== 13
                    ? 'rd'
                    : 'th';

    return `${day}${suffix} ${date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    })}`;
}