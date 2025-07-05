import { Link, useLocation } from "react-router-dom";

const BreadcrumbNavigation = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  return (
    <div className="my-5 text-sm text-gray-600">
      <div
        className="w-[70%] overflow-hidden whitespace-nowrap truncate"
        title={`Home / ${pathParts.join(" / ")}`}
      >
        <Link to="/" className="hover:text-blue-600 font-medium">
          Home
        </Link>
        {pathParts.map((part, index) => {
          const fullPath = "/" + pathParts.slice(0, index + 1).join("/");
          const isLast = index === pathParts.length - 1;

          return (
            <span key={index}>
              &nbsp;/&nbsp;
              {isLast ? (
                <span>{part}</span>
              ) : (
                <Link to={fullPath} className="hover:text-blue-600">
                  {part}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default BreadcrumbNavigation;
