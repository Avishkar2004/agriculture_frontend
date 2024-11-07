import React, { useState } from "react";
import { Link } from "react-router-dom";
import Refund from "./Refund";

const Shipping = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-gray-100 mt-4 min-h-screen">
      <div className="w-1/2 bg-white text-start p-8  border-r-2 border-l-2 border-t-2 border-b-2">
        <p className="text-2xl font-primary font-bold text-[#1e2d7d] mb-4">
          Shipping policy
        </p>
        <p className="font-secondary font-semibold text-gray-400 mb-4 mt-9">
          SHIPPING
        </p>
        <p className="font-secondary font-semibold text-[#1e2d7d] mb-4 mt-9">
          KEY FEATURES :
        </p>
        <ul
          className="font-secondary text-[#677279] pl-4 space-y-5"
          style={{ listStyleType: "disc" }}
        >
          <li>
            Our Shipping Partners are
            <span className="text-black text-lg">
              Delhivery, DTDC, and Agritell Shipping.
            </span>
          </li>
          <li>
            Shipping charges depend upon the total order value of your order.
          </li>
          <li className="text-black text-lg">
            We will ship the products within 24 hours after getting the order(s)
            except Sunday, local and national holidays. The products would
            deliver by 7-8 days.
          </li>
          <li className="text-black text-lg">
            The shipping might be impacted due to natural calamities.
          </li>
          <li className="text-black text-lg">
            The products would deliver by 7-8 days.
          </li>
          <li>
            We will send the tracking link to both the registered email ID and
            mobile number immediately after fulfillment. Using this link, you
            can see the courier name, tracking number, expected date of
            delivery, and exact location of the packet(s).
          </li>
          <li>
            You can track your order using order confirmation link that you
            received in your registered email. Kindly use the correct email to
            get updated the order related information including shipping. See
            this video.
          </li>
        </ul>

        {showMore && (
          <>
            <div>
              <div>
                <p className="font-secondary font-semibold text-[#1e2d7d] mb-4 mt-9">
                  SHIPPING CHARGES:
                </p>
                <div className="space-x-12 space-y-12 gap-7">
                  <table className="space-x-12 space-y-12 gap-12 gap-x-12 gap-y-12">
                    <thead>
                      <tr className="border-r border-l border-t border-b space-y-12">
                        <th>Rate Name</th>
                        <th>Condition (Order Value)</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody className="border-r border-l border-t border-b space-y-12">
                      <tr>
                        <td>Minimum Shipping</td>
                        <td>From Rs.0 to Rs.499/-</td>
                        <td>₹50/-</td>
                      </tr>
                      <tr className="border-r border-l border-t border-b space-y-12">
                        <td>Light Shipping</td>
                        <td>From Rs.500/- to Rs.999/-</td>
                        <td>₹70/-</td>
                      </tr>
                      <tr className="border-r border-l border-t border-b space-y-12">
                        <td>Standard Shipping</td>
                        <td>From Rs.1000/- to Rs.1499/-</td>
                        <td>₹90/-</td>
                      </tr>
                      <tr className="border-r border-l border-t border-b space-y-12">
                        <td>Heavy Shipping</td>
                        <td>From Rs.1500/- to Rs.1999/-</td>
                        <td>₹110/-</td>
                      </tr>
                      <tr className="border-r border-l border-t border-b space-y-12">
                        <td>Free Shipping</td>
                        <td>From Rs.2000/-</td>
                        <td>Free</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="font-secondary font-semibold text-[#1e2d7d] mb-4 mt-7">
                <p>KEY POINTS :</p>
                <ul
                  className="font-secondary mt-5 text-[#677279] pl-4 space-y-5"
                  style={{ listStyleType: "disc" }}
                >
                  <li>
                    We took paid shipping/ delivery services from third-party
                    logistics companies. They will do this shipping. We may
                    change the third logistics company at our end without any
                    notification.
                  </li>
                  <li>
                    Delivery could take a little longer for remote locations and
                    shall depend on the third-party logistics company’s
                    policies.
                  </li>
                  <li>
                    Orders will dispatch within 24 working hours; it is the
                    minimum time taken to prepare the order.
                    <span className="text-black/70">
                      However, for the order of the living plants, we will take
                      a minimum of 3 days, to process the orders.
                    </span>
                  </li>
                  <li>
                    Users are requested to enter the
                    <span className="text-black/70">
                      correct billing address
                    </span>
                    , as it appears on Govt. approved documents or your bank or
                    credit card statement.
                  </li>
                  <li>
                    The client must give the
                    <span className="text-black/70">
                      only one correct mobile number
                    </span>
                    , so all the delivery related SMS you will get timely, and
                    the delivery boys would be contacting you successfully at
                    the time of final delivery.
                  </li>
                  <li>
                    If the address proof does not match with the given billing
                    address that you provided at the time of placing an order,
                    you will not get this order finally, as the delivery boys
                    check the address proof if any complaint arose.
                  </li>
                  <li className="text-black/70">
                    Products will ship every day except Sundays, public
                    holidays, or during non-working hours.
                  </li>
                  <li>
                    Make sure also to enter the
                    <span className="text-black/70">
                      {" "}
                      correct shipping address{" "}
                    </span>
                    (Street number and name, landmark, City, State, and Pin
                    code) as we are not liable for the package(s) that delivered
                    to the wrong address.
                  </li>
                  <li>
                    If the order has not delivered and returned due to Your
                    unavailability, You would be liable to pay the charges for
                    re-delivering the product to You.
                  </li>
                  <li>
                    The Company/Website does not track the shipment or follow up
                    with the third-party logistics companies. We have partnered
                    with them.
                  </li>
                  <li>
                    <span className="text-black/70">
                      If you are facing shipping related issues
                    </span>
                    , kindly drop an email to
                    <Link to="" className="text-cyan-500">
                      admin@agritell.com
                    </Link>
                    from the registered e-mail.
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
        {showMore ? (
          <button
            onClick={() => setShowMore(false)}
            className="text-[#1e2d7d] underline mt-4 "
          >
            View Less
          </button>
        ) : (
          <button
            onClick={() => setShowMore(true)}
            className="text-[#1e2d7d] underline mt-4"
          >
            View More
          </button>
        )}
      </div>
      <Refund />
    </div>
  );
};

export default Shipping;
