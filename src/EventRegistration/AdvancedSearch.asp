<html>
<head>

<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Place a Classified Ad</title>
<link rel="shortcut icon" href="/LittleShrew.ico" /> 
<link rel="icon" href="http://www.GreenShrew.com/LittleShrew.ico" /> 
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="<%=Style%>">


<SCRIPT LANGUAGE="JavaScript">
<!-- Original:  Brian Swalwell -->

<!-- This script and many more are available free online at -->
<!-- The JavaScript Source!! http://javascript.internet.com -->

<!-- Begin
function validateZIP(field) {
var valid = "0123456789-";
var hyphencount = 0;


for (var i=0; i < field.length; i++) {
temp = "" + field.substring(i, i+1);
if (temp == "-") hyphencount++;
if (valid.indexOf(temp) == "-1") {
alert("Invalid characters in your zip code.  Please try again.");
return false;
}
if ((hyphencount > 1) || ((field.length==10) && ""+field.charAt(5)!="-")) {
alert("The hyphen character should be used with a properly formatted 5 digit+four zip code, like '12345-6789'.   Please try again.");
return false;
   }
}
return true;
}
//  End -->
</script>






<% 
Subject=request.form("Subject") 
If Len(Subject) < 3 then
	Subject= Request.QueryString("Subject") 
End If

conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" 



Dim CategoryID(1000)
Dim CategoryName(1000)

Dim SubCategoryID(1000)
Dim SubCategoryName(1000)

conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" 

 sql = "select * from Categories  Order by CategoryType, CategoryName"
			'response.write(sql2)
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3 
	If Not rs.eof Then
	SubCatCounter= 0
    OldCategoryType = rs("categoryType")


	Varieties =  Varieties  & " ["" Select a Category "", "
	While Not rs.eof 
		OldCategoryType = rs("categoryType")
		CatCounter= CatCounter +1
		CategoryID(CatCounter) = rs("CategoryID") 
		CategoryName(CatCounter) = rs("CategoryName") 
		Varieties  = Varieties & """"  & CategoryName(CatCounter)  %>
		
      

		<% rs.movenext
		    	If Not rs.eof Then 
					NewCategoryType = rs("CategoryType")
				End If 
		 If Not(OldCategoryType = NewCategoryType) then
				Varieties  = Varieties & """ ]," & vbCrLf  & " ["" Select a Category "
		End If 


			If Not(rs.eof) Then 
				Varieties  = Varieties  &  """ , " 
			 End If 
	Wend
End If 	
Varieties  = Varieties  &  """ ] " 

FinalSubCatCounter2 = SubCatCounter2
   		FinalSubCatCounter = CatCounter

'Varietielen  = Len(Varieties)
'response.write(Varietielen)
'Varieties = Left(Varieties, (Varietielen-1))
%>



 <script type="text/javascript">
<!--
var varieties=[<%=Varieties%>];

function Box2IDpick(box2pick) {
var f=document.myform;
f.box2ID.value=null;

f.box2ID.value = box2pick
}


 //-->
</script>




<script type="text/javascript">
var varieties=[<%=Varieties%>];

function Box2(idx) {
var f=document.myform;
f.box2.options.length=null;
for(i=0; i<varieties[idx].length; i++) {
    f.box2.options[i]=new Option(varieties[idx][i], i); 
    }    
}

onload=function() {Box2(0);};
</script>
</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="adminHeader.asp"-->


<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"    width = "600">
	<tr>
		<td class = "body" valign = "top"  >
			<H1>Advanced Search<br>
			<img src = "images/underline.jpg" width = "600"></H1>
		</td>
	</tr>
</table>


<form name="myform" method="post" action= 'SearchResults.asp' onSubmit="return validateZIP(this.zip.value)">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "600">
<tr>
			<td  class = "body" align = "right" width = "200" height = "40">
			Type of Ad:
		</td>
		<td width = "470" class = "body" >
			<select name="subject" onchange="Box2(this.selectedIndex)">
				<option value="Barter">Barter</option>
				<option value="Donation">Donation</option>
				<option value="For Sale">For Sale</option>
				<option value="WantAd">Wanted</option>
			</select>
		</td>
	</tr>
	<tr>
			<td  class = "body" align = "right" height = "40">
			Category:
		</td>
		<td width = "570">
			<select name="box2" onchange="Box2IDpick(this.selectedIndex)"></select>
			<input name="box2ID" size = "30" value = "0" type = "hidden">
		</td>
		</tr>
			<tr>
						  	<td  class = "body" align = "right" height = "40">Region:</td>
							<td class = "body">
							  <select  name="Region">
								<option value="Any" selected>Any</option>
							 	<option  value= "Northeast" >US-Northeast</option>
								<option  value= "Midwest">US-Midwest</option>
								<option value= "South">US-South</option>
								<option  value= "West">US-West</option>
							  </select>
							</td>
						</tr>
						<tr>
						  	<td  class = "body" align = "right" height = "40">State:</td>
						<td class = "body">
								<select size="1" name="State">
									<option value="Any" selected>Any</option>
									<option value="AL"> Alabama </option>
									<option  value="AK"> Alaska </option>
									<option  value="AZ"> Arizona </option>
									<option  value="AR"> Arkansas </option>
									<option  value="CA"> California </option>
									<option  value="CO"> Colorado </option>
									<option  value="CT"> Connecticut </option>
									<option  value="DE"> Delaware </option>
									<option  value="DC"> District of Columbia </option>
									<option  value="FL"> Florida</option>
									<option  value="GA"> Georgia </option>
									<option  value="HI"> Hawaii </option>
									<option  value="ID"> Idaho </option>
									<option  value="IL"> Illinois </option>
									<option  value="IN"> Indiana </option>
									<option  value="IA"> Iowa </option>
									<option  value="KS"> Kansas </option>
									<option  value="KY"> Kentucky </option>
									<option  value="LA"> Louisiana </option>
									<option  value="ME"> Maine </option>
									<option  value="MD"> Maryland </option>
									<option  value="MA"> Massachusetts </option>
									<option  value="MI"> Michigan </option>
								   <option  value="MN"> Minnesota </option>
									<option  value="MS"> Mississippi </option>
									<option  value="MO"> Missouri </option>
									<option  value="MT"> Montana </option>
									<option  value="NE"> Nebraska </option>
									<option  value="NV"> Nevada </option>
									<option  value="NH"> New Hampshire </option>
									<option  value="NJ"> New Jersey </option>
									<option  value="NM"> New Mexico </option>
									<option  value="NY"> New York </option>
									<option  value="NC"> North Carolina </option>
									<option  value="ND"> North Dakota </option>
									<option  value="OH"> Ohio </option>
									<option  value="OK"> Oklahoma </option>
									<option  value="OR"> Oregon </option>
									<option  value="PA"> Pennsylvania </option>
									<option  value="RI"> Rhode Island </option>
									<option  value="SC"> South Carolina </option>
									<option  value="SD"> South Dakota </option>
									<option  value="TN"> Tennessee </option>
									<option  value="TX"> Texas </option>
									<option  value="UT"> Utaha </option>
									<option  value="VT"> Vermont </option>
									<option  value="VA"> Virginia </option>
									<option  value="WA"> Washington </option>
									<option  value="WV"> West Virginia </option>
									<option  value="WI"> Wisconsin </option>
									<option  value="WY"> Wyoming </option>
								</select>
							</td>
						<tr>
						<tr>
							<tr>
						  	<td  class = "body" align = "right" height = "40">Zip:</td>
							<td class = "body">
									<input type=text size=10 name=zip>
							</td>
						</tr>


		<tr>
			<td  colspan = "2" align = "center" valign = "middle" class = "body" >
			<br>
				<input name="Subject" value = "<%=Subject%>" type = "hidden">
			<input type=submit value = "Search" style="background-image: url('images/background.jpg'); border-width:1px" size = "310" class = "menu" >
			<input type="reset" value = "Reset" style="background-image: url('images/background.jpg'); border-width:1px" size = "310" class = "menu" >
			
			</form>
		</td>
</tr>
</table>

 
 
<br><br><br>
<!--#Include file="Footer.asp"--> </Body>
</HTML>