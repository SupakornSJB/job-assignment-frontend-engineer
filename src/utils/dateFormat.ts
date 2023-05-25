const dateOptions: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };

export const formatDate = (dateString: string): string => {
    return (new Date(dateString).toLocaleDateString(undefined, dateOptions)).toString()
}