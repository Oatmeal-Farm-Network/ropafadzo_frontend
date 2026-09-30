<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"   "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Place a Classified Ad</title>
<link rel="shortcut icon" href="/LittleShrew.ico" /> 
<link rel="icon" href="http://www.GreenShrew.com/LittleShrew.ico" /> 
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="<%=Style%>">

<% 
Dim CategoryID(100,100)
Dim CategoryName(100,100)

conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" 

			 sql = "select * from Categories" 
			'response.write(sql2)
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3 
	CatCounter= 0
	 While Not rs.eof 
		CatCounter = CatCounter + 1
		CategoryID(CatCounter,0) = rs("CategoryID")
		CategoryName(CatCounter,0) = rs("CategoryName")
'response.write(CategoryName(CatCounter,0))
		rs.movenext
	Wend
		FinalCatCounter = CatCounter




 sql = "select * from SubCategories" 
			'response.write(sql2)
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3 
	CatCounter= 0
	LatestCategory = rs("CategoryID")
While CatCounter < (FinalCatCounter +1) 
   CatCounter = CatCounter +1 
	SubCatCounter = 0
	Varieties =  Varieties  & " ["" Sub Categories "", "
	 While  Not rs.eof And LatestCategory = CatCounter
		SubCatCounter = SubCatCounter+ 1
		CategoryID(CatCounter,SubCatCounter) = rs("SubCategoryID")
		CategoryName(CatCounter,SubCatCounter) = rs("SubCategoryName")
		Varieties  = Varieties & """"  & CategoryName(CatCounter,SubCatCounter) & """ , "


			LatestCategory = rs("CategoryID")
		rs.movenext
	Wend
	Varieties  = Varieties & """"  & CategoryName(CatCounter,SubCatCounter) & """"
	Varieties  = Varieties & " ]," & vbCrLf
wend
'response.write(Varieties)

   		FinalSubCatCounter = CatCounter
%>



<title>Change selection in one box from another</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">



<script type="text/javascript">
<!--
var varieties=[<%=Varieties%>

];

function Box2(idx) {
var f=document.myform;
f.box2.options.length=null;
for(i=0; i<varieties[idx].length; i++) {
	f.box2.options[i]=new Option(varieties[idx][i], i); 
    }    
}

onload=function() {Box2(0);};
 //-->
</script>
</head>
<body>


<form name="myform" method="post" action="#">
<div>
<select name="box1" onchange="Box2(this.selectedIndex)">
<% 
	CatCounter = 0
		While   CatCounter  < FinalCatCounter +1
		CatCounter = CatCounter+ 1 %>
		<option value="<%=CategoryName(CatCounter,0)%>"><%=CategoryName(CatCounter,0)%></option>

		
		
	<% Wend %>
	

</select>
<select name="box2" onchange=""></select>
</div>
</form>
</body>
</html>


