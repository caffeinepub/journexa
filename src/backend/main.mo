import Time "mo:core/Time";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  // Keep whatsapp field for stable storage compatibility with existing data
  type Submission = {
    id : Nat;
    name : Text;
    whatsapp : Text;
    timestamp : Int;
  };

  type SubmissionWithScreenshot = {
    id : Nat;
    name : Text;
    timestamp : Int;
    screenshotUrl : ?Text;
  };

  let submissions = Map.empty<Nat, Submission>();
  let screenshotUrls = Map.empty<Nat, Text>();
  var nextId = 0;
  let adminPassword = "admin123";

  // whatsapp param removed from public API — stored as empty string internally
  public shared ({ caller }) func submitTradeReview(name : Text, screenshotUrl : ?Text) : async () {
    let submission : Submission = {
      id = nextId;
      name;
      whatsapp = "";
      timestamp = Time.now();
    };
    submissions.add(nextId, submission);
    switch (screenshotUrl) {
      case (?url) { screenshotUrls.add(nextId, url); };
      case null {};
    };
    nextId += 1;
  };

  public query ({ caller }) func getSubmissions(password : Text) : async [SubmissionWithScreenshot] {
    if (Text.equal(password, adminPassword)) {
      submissions.values().map(func(s : Submission) : SubmissionWithScreenshot {
        {
          id = s.id;
          name = s.name;
          timestamp = s.timestamp;
          screenshotUrl = screenshotUrls.get(s.id);
        };
      }).toArray();
    } else {
      [];
    };
  };
};
