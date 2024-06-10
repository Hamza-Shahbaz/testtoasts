import React from "react";
import FAQItem from "./FAQItem";
import faqImage from "../../assets/images/faqs.jpg"

const Questions = [
  {
    question: "This is the first question This is the first question This is the first question",
    answer:
      "This is the first answer Nulla malesuada iaculis nisi, vitae sagittis lacus laoreet in. Morbi aliquet pulvinar orci non vulputate. Donec aliquet ullamcorper gravida. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed molestie accumsan dui, non iaculis magna mattis id. Ut consectetur massa at viverra euismod. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent eget sem purus.",
  },
  {
    question: "This is the second question This is the second question This is the second question This is the second question",
    answer:
      "This is the second answer Nulla malesuada iaculis nisi, vitae sagittis lacus laoreet in. Morbi aliquet pulvinar orci non vulputate. Donec aliquet ullamcorper gravida. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed molestie accumsan dui, non iaculis magna mattis id. Ut consectetur massa at viverra euismod. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent eget sem purus.",
  },
  {
    question: "This is the third question",
    answer:
      "This is the third answer Nulla malesuada iaculis nisi, vitae sagittis lacus laoreet in. Morbi aliquet pulvinar orci non vulputate. Donec aliquet ullamcorper gravida. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed molestie accumsan dui, non iaculis magna mattis id. Ut consectetur massa at viverra euismod. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent eget sem purus.",
  },
  {
    question: "This is the fourth question",
    answer:
      "This is the fourth answer Nulla malesuada iaculis nisi, vitae sagittis lacus laoreet in. Morbi aliquet pulvinar orci non vulputate. Donec aliquet ullamcorper gravida. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed molestie accumsan dui, non iaculis magna mattis id. Ut consectetur massa at viverra euismod. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent eget sem purus.",
  },
  {
    question: "This is the fifth question",
    answer:
      "This is the fifth answer Nulla malesuada iaculis nisi, vitae sagittis lacus laoreet in. Morbi aliquet pulvinar orci non vulputate. Donec aliquet ullamcorper gravida. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed molestie accumsan dui, non iaculis magna mattis id. Ut consectetur massa at viverra euismod. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent eget sem purus.",
  },
];

const Help = () => {
  return (
    <section className="need-help">
      <div className="container">
        <div className="row">
          <div className="col-xl-7 col-lg-7 col-md-6">
            <div className="left-heading">
              <h1>Frequently Asked Questions </h1>
            </div>
            <div className="faqs-box">
              <div className="accordion">
                <div className="row justify-content-center">
                    {Questions.length > 0 && Questions.map((item, index) => (
                        <FAQItem item={item} key={index}/>

                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-5 col-lg-5 col-md-6">
            <div className="right-col d-flex justify-content-center" style={{maxHeight:"80em", maxWidth:"38em"}}>
               <img src={faqImage} style={{maxWidth:"27em" , borderRadius: '15px' }} className="py-1"/> 
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Help;
